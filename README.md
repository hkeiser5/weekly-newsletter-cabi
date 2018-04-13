# weekly-newsletter-cabi
redesign of cabi's weekly newsletter

Responsive newsletter for cabi created by Heather C. Keiser with use of HTML5, CSS, SCSS, javascript

This was a redesign of the companies current weekly newsletter. Changes from the original:

All text is real text and not imagery, making it searchable.
The header and menus are sticky making maneuverability easier.
Accordion slide downs of content making it less cumbersome on mobile device.
Fully responsive images, calendar, layout, tables, ect.

Interesting things going on in the javascript:
A fully responsive grid based off of flex box that evenly distributes flex items based on the width of their parent element 
and the number of flex items factors. Granted this uses a lot of computing during the resize event, and could be changed to 
only fire during resize when resizing hits various media query points. Making this work with react would also likely speed 
it up if necessary.

A fully responsive calendar that includes events that span multiple days, and removes the weekends.

Select boxes are replaced to look nicer and to limit a user seeing information that is not important to them.

Roll sliding (found in connection-slides) utilizes ease with some simple math.

Within the scss files there are mixins for media queries used all over the place and a mixin for visually hiding 
objects and then reversing that hiding to be used throughout the rest of the scss files.
