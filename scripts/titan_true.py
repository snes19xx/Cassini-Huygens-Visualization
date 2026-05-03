import numpy as np
from PIL import Image, ImageFilter
import os

def simulate_titan_atmosphere(input_path, output_path, optical_thickness=0.85):
    """
    Simulates Titan's thick tholin atmosphere over a surface map.
    
    Parameters:
    input_path (str): Path to the false-color VIMS surface map.
    output_path (str): Destination path for the rendered image.
    optical_thickness (float): 0.0 to 1.0. 
                               1.0 = Mathematically true human vision (featureless orange sphere).
                               0.8 = Highly realistic but retains major geological outlines.
    """
    if not os.path.exists(input_path):
        print(f"Fatal Error: Input file '{input_path}' not found.")
        return

    print("Loading surface map and initializing arrays...")
    img = Image.open(input_path).convert('RGB')
    img_arr = np.array(img).astype(np.float32)
    height, width, _ = img_arr.shape

    # 1. Surface Albedo to Depth Approximation
    # We convert the false-color map to a grayscale luminosity map.
    # We assume dark areas (dunes) are low-elevation and bright areas (Xanadu) are high-elevation.
    luminosity = np.dot(img_arr[..., :3], [0.2989, 0.5870, 0.1140])
    lum_norm = luminosity / 255.0

    # 2. Re-map Surface to Chemical Colors
    # Convert the scientific blue/grey to tholin-brown and water-ice-white
    dark_surface = np.array([35, 20, 10], dtype=np.float32) 
    light_surface = np.array([220, 200, 160], dtype=np.float32)
    
    true_surface_arr = np.zeros_like(img_arr)
    for i in range(3):
        true_surface_arr[..., i] = (dark_surface[i] * (1 - lum_norm) + light_surface[i] * lum_norm)

    # 3. Define Atmospheric Haze Properties
    # Tholin particles strongly scatter red/orange and absorb blue/UV.
    base_haze_color = np.array([205, 135, 35], dtype=np.float32)
    
    # 4. Generate the Polar Hood
    # Titan's winter pole develops a dense, darker brown aerosol cap.
    polar_hood_color = np.array([140, 90, 25], dtype=np.float32)
    haze_layer_arr = np.full((height, width, 3), base_haze_color)

    print("Calculating seasonal polar hood gradient...")
    hood_extent = int(height * 0.18) # Covers top 18% of the globe
    y_indices = np.arange(hood_extent)
    
    # Create a non-linear decay for the polar hood blending
    decay_factor = (1 - (y_indices / hood_extent)) ** 2
    decay_factor = decay_factor.reshape(-1, 1)

    for i in range(3):
        haze_layer_arr[:hood_extent, :, i] = (
            haze_layer_arr[:hood_extent, :, i] * (1 - decay_factor) + 
            polar_hood_color[i] * decay_factor
        )

    # 5. Volumetric Atmospheric Blending
    # Lower elevations (darker lum_norm) get more atmosphere piled on top of them.
    # Higher elevations (brighter lum_norm) peek through slightly more.
    print("Executing depth-dependent Rayleigh/tholin scattering simulation...")
    
    # Calculate local atmospheric opacity based on elevation approximation
    local_opacity = optical_thickness + (0.15 * (1 - lum_norm))
    local_opacity = np.clip(local_opacity, 0.0, 1.0)
    local_opacity_stack = np.dstack([local_opacity]*3)

    final_arr = (true_surface_arr * (1 - local_opacity_stack)) + (haze_layer_arr * local_opacity_stack)
    final_arr = np.clip(final_arr, 0, 255).astype(np.uint8)

    # 6. Apply Photon Scattering (Blur)
    # The thick atmosphere diffuses light heavily, destroying sharp geographical boundaries.
    print("Applying photon diffusion filter...")
    final_img = Image.fromarray(final_arr)
    
    # Blur radius scales with optical thickness. 
    # At 1.0 thickness, blur is extreme. At lower thickness, features are sharper.
    blur_radius = int(45 * optical_thickness)
    if blur_radius > 0:
        final_img = final_img.filter(ImageFilter.GaussianBlur(radius=blur_radius))

    final_img.save(output_path)
    print(f"Execution complete. Output saved to: {output_path}")

if __name__ == "__main__":
    input_file = "titan_bw.jpg"
    output_file = "titan_realistic_atmosphere.jpg"
    
    # Set to 1.0 for absolute scientific reality (a featureless orange sphere).
    # Set to 0.85 to maintain the dense atmospheric look while retaining faint outlines of Xanadu.
    target_thickness = 0.85 
    
    simulate_titan_atmosphere(input_file, output_file, optical_thickness=target_thickness)