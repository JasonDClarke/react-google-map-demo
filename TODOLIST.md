DONE:
Fix package audit
Api key added initially
Added initial locations
Found starter repo for react map
Has marker clustering, default markers, map rendering.
Cleaned up starter code for use case
Added autocomplete component
Trigger centering of map on autocomplete selection
Fix zooming and panning on click of markers
Remove duplicate data
Typescript passing
Create basic info sidebar
Use churchsuite data with latitude and longitude added
Update versions of packages (eg latest vis.gl/react-google-maps) - improvement in performance noted
Add eslint lnting to code
Add prettier and husky to code
Add centering functionality and some warning comments in code about code optimizations
Add font-face of learnworlds
Make sidebar responsive on mobile
Show closest location if nothing found within 5 miles
Add warning comments about api billing
Add link to youtube explining point of autocomplete billing
Tried Searchbox alternative - billing not improved
Put apiKey into gitignored file and cleared old api keys, this will mean I can push repo without exposing the key
Added a manual api usage report analysis
Tried custom autocomplete  with combobox
Added debounce functionality - confirmed api usage is reduced.
Add logic to update map when selecting autocomplete result from debounced autocomplete widget
Update api usage script with new result and more scenarios
Added functionality to center on current location.
Increase default map zoom to show more map
Add centring logic so close markers are green
Fixed click event on click of cluster so map is centred and sidebar updates
Fixed conflict of map/Satellite button and search bar.


TODO/WIP:
Improve zoom/click functionality to work better in all scenarios. EG if searching random place with no results, increase the zoom to show more (or just warn no results)
Improve debounce autocomplete so debounce is not too annoying
Fix loader on autocomplete box
Test and confirm my location functionality works with:
(no permissions) - permission not set - permission granted

Host app in google cloud.

Add repo to github for access - dont expose PII or api key.

Iframe setup testing
Desktop learnworld integration & testing
Mobile learnworld add to real device & testing

Performance improvements on marker rendering (eg only render visible markers)

Design improvements for mobile/ review design/function for mobile based on device testing

Collect design/data requirements for sidebar.

Fix font/work out how to use learnworlds font best/correctly in the iframe.

Set api key(s) restrictions to:
  - only allow usage for Maps Javascript API and Places API
  - only work from learnworlds app url or the app

Add api billing warnings for especially places api (usage of places api will likely be more costly than just the map itself)

Set some quotas so that total price cannot exceed a certain limit in a month.

iOs/real device testing. QA scripting.

Ideas/options/later (less priority):

Consider ways to reduce api usage - eg having a 2 step process, to complete form then generate the map / custom geocoding logic (note have to be careful not to break google terms of service). Add more ways to search without using autocomplete so less people click on it.

Show 3/2/1 icon for 3 closest churches.

Add function to centre map on church by clicking on it in the sidebar

Add alternative ways to search, eg searching the churchsuite data. 

Add church names to autocomplete.

Replace marker icons with something cooler.

Add search by denomination/denomination markers.

Show directions to closest church (NOTE THIS results in api cost - Distance Matrix api)

Improve management of data - eg create api for the data. (would probably have to add data to some db somewhere eg supabase or something because churchsuite doesnt seem to have api for form data.)

Fix bugs/bad user experience (especially mobile)
Improve rendering performance

Improve flow to update map in learnworlds based on new data/
Documentation of how to update map
(current flow would be:
  export churchsuite csv
  run cleanup utility 
  manual review
  Add json file to map repo
  commit + Push map repo code to remote repository
  redeploy new repo code to google cloud
  (learnworld should not need to be updated in theory since the url of the iframe should stay the same. )
)

Block unused country info from autocomplete.

Make locale-specific improvements (AUS/NZ/Tasmania, UK, US/Canada)

Add tests to repo?