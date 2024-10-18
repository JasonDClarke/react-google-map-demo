Here is list of use cases and their api usage based on MANUAL testing par 18th Oct 2024.
This is calculated manually by:
Use a test api key that is only used by developer
See before: https://console.cloud.google.com/google/maps-apis/metrics 
Running the steps
Waiting 3-5 minutes
See after: https://console.cloud.google.com/google/maps-apis/metrics
Take the diff

This test takes about 15-30 minutes to complete

Use case 1: Open page
Maps Javascript Api: 1 hit

Use case 2a: Open Page and type "Watford" in search bar (quickly so debounce is enacted)
Maps Javascript Api: 1 hit
Places api: 1 hits

Use case 2b: Open Page and type "Watford" in search bar (slowly so debounce is not enacted)
Maps Javascript Api: 1 hit
Places api: 7 hits

Use case a: Open Page, type "Watford" in search bar, Select Watford (quickly so debounce is enacted)
Maps Javascript Api: 1 hits
Places api: 1 hits

Use case b: Open Page, type "Watford" in search bar, Select Watford (slowly so debounce is not enacted)
Maps Javascript Api: 1 hits
Places api: 7 hits

Use case 4: Open page, Select a marker
Maps Javascript Api: 1 hit

Use case 5: Open page, use streetview
Maps Javascript Api: 1 hit

Use case 6: Open page, type "Empire state building, USA" in search bar
Maps Javascript Api: 1 hit
Places api: 25 Hits

Extended tests:
Repeat on mobile:
Use case 1: Open page
Maps Javascript Api: 1 hit

Use case 2a: Open Page and type "Watford" in search bar (quickly so debounce is enacted)
Maps Javascript Api: 1 hit
Places api: 1 hits

Use case 2b: Open Page and type "Watford" in search bar (slowly so debounce is not enacted)
Maps Javascript Api: 1 hit
Places api: 7 hits

Use case a: Open Page, type "Watford" in search bar, Select Watford (quickly so debounce is enacted)
Maps Javascript Api: 1 hits
Places api: 1 hits

Use case b: Open Page, type "Watford" in search bar, Select Watford (slowly so debounce is not enacted)
Maps Javascript Api: 1 hits
Places api: 7 hits

Use case 4: Open page, Select a marker
Maps Javascript Api: 1 hit

Use case 5: Open page, use streetview
Maps Javascript Api: 1 hit

Use case 6: Open page, type "Empire state building, USA" in search bar
Maps Javascript Api: 1 hit
Places api: 25 Hits