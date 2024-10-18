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

Use case 2: Open Page and type "Watford" in search bar
Maps Javascript Api: 1 hit
Places api: 7 hits

Use case 3: Open Page, type "Watford" in search bar, Select Watford
Maps Javascript Api: 1 hit
Places api: 7 hits

Use case 4: Open page, Select a marker
Maps Javascript Api: 1 hit

Use case 5: Open page, use streetview
Maps Javascript Api: 1 hit

Use case 6: Open page, type "Empire state building, USA" in search bar
Maps Javascript Api: 1 hit
Places api: 25 Hits