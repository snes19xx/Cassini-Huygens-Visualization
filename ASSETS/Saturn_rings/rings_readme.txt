A model of Saturn's rings

This model of Saturn's rings was created from images obtained by the Voyager spacecraft plus the Voyager stellar occultation optical depth profile data I downloaded from this page at the Planetary Rings Node.

I started by measuring radial profiles in Voyager images obtained at three different viewing/lighting geometries:

(1) Backscattered light. In this case one is looking at the rings from roughly the direction of the sun. Here I used a few Voayger 2 narrow angle images.
(2) Forward scattered light. Here one is looking at the rings from a direction roughly opposite from the direction of the sun but the observer and the sun are still on the same side of the ring plane. In this case I used Voyager 1 wide angle images.
(3) The unlit side. This is the appearance of the rings when the observer and the sun are on opposite sides of the ring plane. Thus the observer sees how well sunlight filters through the rings. Very dense areas appear dark but relatively transparent areas apppear bright. In this case I used Voyager 1 wide angle images.

This resulted in three ring profiles at different resolutions and where the major ring features didn't exactly match when comparing different profiles. The next step was to process the optical depth profile I downloaded. It has a resolution of 5 km (13177 values) and all of the ring features are at their correct location in this data set. Transparency is more useful in 3D rendering than optical depth so I converted the optical depth values to transparency values. I then edited the resulting data in Excel, mainly to correct areas that I knew are devoid of ring material (the gap between the F ring and the outer edge of the A ring is a good example) because the transparency in these areas wasn't always 1.0 due to noise in the data.

Following this I determined the position of several prominent ring features (gap edges etc.) in all four data sets and then resampled the three image derived profiles to the same resolution as the transparency profile (which had a resolution several times higher) using the position measurements as a guide. The end result was four profiles where ring features match almost perfectly.

Until recently I used uniform color when rendering the rings but now, thanks to NASA's Cassini spacecraft, greatly improved color information is available. I used a Cassini color image to construct a color profile and in fact I expect to replace all of these profiles in the future with new versions based on more accurate and higher resolution Cassini data.

The five profiles can be downloaded as text files below or a lower resolution PNG image. In all cases the left edge of the images is at a distance of 74510 km from Saturn's center and the right edge is 140390 km from it. Likewise, the text files start at 74510 km from Saturn's center. Beware that the resolution of the PNG images is much lower than the resolution of the text files which contain 13177 values each. However, the resolution of the profiles derived from the imaging data is several times lower than this but (as mentioned above) has been resampled to match the transparency data in size and the location of major ring features.

Backscattered light

Saturn's rings - backscattered light

The image above shows the side of the rings lit by the sun as observed from approximately the direction of the sun. This data is also available as a text file of 13177 brightness values ranging from 0 to 1. Beware that completely black areas (intensity 0 in the text file) are areas containing no ring material while very dark areas usually contain a little ring material but might in theory contain a lot of low albedo material. So it's really not possible to use this data alone, you need the transparency profile as well.

Forward scattered light

Saturn's rings - forward scattered light

This image shows the appearance of the rings at a phase angle of 139 degrees, i.e. in forward scattered light. This data is also available as a text file of 13177 brightness values ranging from 0 to 1.

The unlit side

Saturn's rings - the unlit side

This image shows the appearance of the rings from the unlit side. This data is also available as a text file of 13177 brightness values ranging from 0 to 1. In this case completely black areas are either completely transparent or contain so much material that no sunlight passes through them. You will need the transparency profile to distinguish between these possibilities.

Transparency

Saturn's rings - transparency

This image shows the transparency. Areas with no ring material are white while completely opaque areas are black. This data is also available as a text file of 13177 transparency values ranging from 0 to 1.

Color

sat_ring_color.png (3398 bytes)

This image shows the color of the rings. It is based on this Cassini image but the color saturation has been reduced a bit. The color may look weird but when combined with the backscattered or forward scattered light profiles above the result is extremely realistic. However, a different color is needed for the unlit side. I currently use red=1.0, green=0.97075 and blue=0.952 but expect to construct a new color profile in the future based on Cassini images. This data is also available as a text file of 13177 color values.

How to render the rings

This is a very complicated subject which may require trial and error.

At a phase angle of 0 degrees (looking at them exactly from the direction of the sun) the rings appear like the topmost profile but with increasing phase angle their appearance gradually changes to the appearance of the forward scattering profile. Also the overall brightness of the rings decreases significantly with increasing phase angle and they also become slightly redder with increasing phase angle.

The brightness of the rings changes only slightly with changes in solar elevation angle as seen from roughly the direction to the sun (e.g. as seen from Earth).