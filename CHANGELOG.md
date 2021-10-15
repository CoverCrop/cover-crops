# Change Log
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Checkbox on the dashboard component graphs to switch between "only cover crop duration" and "all years". Defaults to latter. [CCROP-360](https://opensource.ncsa.illinois.edu/jira/browse/CCROP-360)

### Changed
- Fetch job runs on dashboard by using a paginated workflow specific datawolf api. Improves dashboard load time. [CCROP-350](https://opensource.ncsa.illinois.edu/jira/browse/CCROP-350)

### Fixed
- Errors on "My Farm" page when no fields are defined [CCROP-362](https://opensource.ncsa.illinois.edu/jira/browse/CCROP-362)
- Output dashboard parsing to use the new DSSAT variables. [CCROP-373](https://opensource.ncsa.illinois.edu/jira/browse/CCROP-373)
- Bug on "Crop History" page that was reverting changes made to Planting, Harvest and Tillage when adding a new fertilizer. [CCROP-361](https://opensource.ncsa.illinois.edu/jira/browse/CCROP-361)
- Creating fields when entering latitude and longitude manually. It was picking up a previous field's CLU [CCROP-263](https://opensource.ncsa.illinois.edu/jira/browse/CCROP-263)

## [1.3.0] - 2021-07-28

### Added
- Year 2021 to cash crop year selection. Enabled "N Loss Reduction" graph.

### Changed
- Use react-scripts for package management and build creation [CCROP-259](https://opensource.ncsa.illinois.edu/jira/browse/CCROP-259)
- Farm Summary layout is updated so there is clear separation between headers and rows [CCROP-238](https://opensource.ncsa.illinois.edu/jira/browse/CCROP-238)
- Fixed Decomposition graph so C:N ratio is capped at 33 for display [CCROP-354](https://opensource.ncsa.illinois.edu/jira/browse/CCROP-354)

### Fixed
- On dashboard, display the component graphs' main title and axes titles. Bug caused due to ChartJS v3 upgrade. [CCROP-355](https://opensource.ncsa.illinois.edu/jira/browse/CCROP-355)

## [1.2.0] - 2021-03-26

### Added
- Add footer with partner logos to landing page [CCROP-338](https://opensource.ncsa.illinois.edu/jira/browse/CCROP-338)
- Option to select Tile Drainage type when adding a new field [CCROP-335](https://opensource.ncsa.illinois.edu/jira/browse/CCROP-335)

### Changed
- Run Cards of Dashboard will show farm name instead of farm coordinates [CCROP-220](https://opensource.ncsa.illinois.edu/jira/browse/CCROP-220)

## [1.1.1] - 2020-12-18

### Added
- Flag to conditionally show/hide Nitrogen Loss Reduction. Production will be configured to hide them until the results are validated [CCROP-330](https://opensource.ncsa.illinois.edu/jira/browse/CCROP-330)

## [1.1.0] - 2020-12-15

### Added
- Display warning message when user tries to add a field without soil data as well as in the summary page for such a field. [CCROP-317](https://opensource.ncsa.illinois.edu/jira/browse/CCROP-317)
- Validation on cover crop and cash crop planting dates when running a job [CCROP-316](https://opensource.ncsa.illinois.edu/jira/browse/CCROP-316)
- "Growing Degree Days" popup graph to the Dashboard [CCROP-319](https://opensource.ncsa.illinois.edu/jira/browse/CCROP-319)

### Changed
- The app will now redirect to "Start A Job" page after logging in [CCROP-321](https://opensource.ncsa.illinois.edu/jira/browse/CCROP-321)
- Home Page text and updates to GDD graph [CCROP-327](https://opensource.ncsa.illinois.edu/jira/browse/CCROP-327)

### Fixed
- Summary page breaking when soil data unavailable for a field. [CCROP-317](https://opensource.ncsa.illinois.edu/jira/browse/CCROP-317)
- Summary page displaying values in SI when there are multiple fertilizers [CCROP-321](https://opensource.ncsa.illinois.edu/jira/browse/CCROP-321)
- Fertilizer value changes are not being displaying after saving, a manual refresh was needed to see the correct values. [CCROP-324](https://opensource.ncsa.illinois.edu/jira/browse/CCROP-324)

## [1.0.0] - 2020-09-30

### Added
- Tooltip to show conversion of 1 lb cereal rye to seed count [CCROP-303](https://opensource.ncsa.illinois.edu/jira/browse/CCROP-303)
- Popup when adding a new field to let users know that we are populating defaults from cropland datalayer [CCROP-300](https://opensource.ncsa.illinois.edu/jira/browse/CCROP-300)
- Popup to warn IE users that the tool is not supported in their browser [CCROP-197](https://opensource.ncsa.illinois.edu/jira/browse/CCROP-197)
- Banner on the home page to indicate that a login is needed and tips on how to use the tool [CCROP-308](https://opensource.ncsa.illinois.edu/jira/browse/CCROP-308)

### Changed
- Replaced decomposition mock data with real api call [CCROP-282](https://opensource.ncsa.illinois.edu/jira/browse/CCROP-282)
- Updated text and image on the homepage. Scaled the grid sizes  [CCROP-299](https://opensource.ncsa.illinois.edu/jira/browse/CCROP-294)
- Included year 2020 for crop selections [CCROP-294](https://opensource.ncsa.illinois.edu/jira/browse/CCROP-294)
- Text on the home page and the job failure error message [CCROP-307](https://opensource.ncsa.illinois.edu/jira/browse/CCROP-307)
- Planting defaults for cereal rye [CCROP-309](https://opensource.ncsa.illinois.edu/jira/browse/CCROP-309)
- Set Fallow event name to "\<year\> Fallow-1". [CCROP-295](https://opensource.ncsa.illinois.edu/jira/browse/CCROP-295)

### Fixed
- Loading spinner will always be cleared when transitioning from 'Run A Job' page to 'Dashboard'. Added missing condition check for 'Queued' datawolf state [CCROP-270](https://opensource.ncsa.illinois.edu/jira/browse/CCROP-270)
- Handled cases when the user has no jobs and when selected job failed, so the Dashboard will show appropriate message instead of spinning indefinitely [CCROP-281](https://opensource.ncsa.illinois.edu/jira/browse/CCROP-281)
- Fertilizer amount units to show lb/acre in both Crop History & Summary tabs, but it's updates through PATCH endpoint will get converted to kg/ha [CCROP-279](https://opensource.ncsa.illinois.edu/jira/browse/CCROP-279)
- Unit conversions and precision of the fields in inches, lbs/acre and seeds/acre are fixed so they conform to DSSAT specifications [CCROP-291](https://opensource.ncsa.illinois.edu/jira/browse/CCROP-291)
- Replace File() with Blob() so the tool is comptaible with Microsoft Edge versions under 79. [CCROP-290](https://opensource.ncsa.illinois.edu/jira/browse/CCROP-290)
- Formatted timezone in dates as per ECMA262 standard so dashboard results will show in correct order and job run time in Safari. [CCROP-227](https://opensource.ncsa.illinois.edu/jira/browse/CCROP-227)
- Fix setting default harvest dates for cash and cover-crops. [CCROP-304](https://opensource.ncsa.illinois.edu/jira/browse/CCROP-304)
- Fix displaying fertilizer and crop tillage if there are no crops in the crop history page. [CCROP-305](https://opensource.ncsa.illinois.edu/jira/browse/CCROP-305)
- Issue with dashboard showing only the first cover crop chart. [CCROP-251](https://opensource.ncsa.illinois.edu/jira/browse/CCROP-251)
- Nitrogen Loss Reduction graphs to not exclude 0 values. [CCROP-313](https://opensource.ncsa.illinois.edu/jira/browse/CCROP-313)

### Removed
- Remove "None" from cash crop drop down options. [CCROP-311](https://opensource.ncsa.illinois.edu/jira/browse/CCROP-311)

### Security
- Fix some npm package vulnerabilities. Also, updated "openlayers" to "ol" and all its reference methods [CCROP-312](https://opensource.ncsa.illinois.edu/jira/browse/CCROP-312)

## [0.6.0] - 2020-05-29

### Added
- Graphs showing individual cover crop parameter results (N Loss, N Uptake etc.) [CCROP-233](https://opensource.ncsa.illinois.edu/jira/browse/CCROP-233)
- Feature to use Cropland Data Layer for gathering crop rotation history. [CCROP-210](https://opensource.ncsa.illinois.edu/jira/browse/CCROP-210)
- Keycloak for authentication and user registration. This obsoletes authentication through datawolf [CCROP-221](https://opensource.ncsa.illinois.edu/jira/browse/CCROP-221)
- Mockup decomposition results including graph, with a config flag to hide it from dashboard [CCROP-255](https://opensource.ncsa.illinois.edu/jira/browse/CCROP-255)

### Fixed
- Dashboard now shows correct numbers even when the selected date had a change due to daylight savings. [CCROP-253](https://opensource.ncsa.illinois.edu/jira/browse/CCROP-253)
- Map tiles now loaded over https to fix mixed content warnings. [CCROP-257](https://opensource.ncsa.illinois.edu/jira/browse/CCROP-257)
- Added no-cache directive to all api calls to workaround a bug that was not updating 'Crop History' in real-time [CCROP-260](https://opensource.ncsa.illinois.edu/jira/browse/CCROP-260)
- Missing cultivar detail in the summary page after updating crop details. [CCROP-267](https://opensource.ncsa.illinois.edu/jira/browse/CCROP-267)
- Improved the condition to check if a crop is cash crop. Now first fallow will not show on Summary tab [CCROP-261](https://opensource.ncsa.illinois.edu/jira/browse/CCROP-261)
- Adding or updating cover crops from 'My Farm' page [CCROP-265](https://opensource.ncsa.illinois.edu/jira/browse/CCROP-265)
- Incorrect calculation of day of the year when the current date is different in local time and GMT. [CCROP-268](https://opensource.ncsa.illinois.edu/jira/browse/CCROP-269)
- Summary page will now display more than 10 crops [CCROP-269](https://opensource.ncsa.illinois.edu/jira/browse/CCROP-268)

### Updated
- Headers of all APIs to use keycloak token for authentication [CCROP-254](https://opensource.ncsa.illinois.edu/jira/browse/CCROP-254)

## [0.5.0] - 2020-03-05

### Added
- Slider selection on dashboard to pick the cover crop harvest date. [CCROP-240](https://opensource.ncsa.illinois.edu/jira/browse/CCROP-240)
- Added loading spinners on Dashboard and "Runs" selection event [CCROP-242](https://opensource.ncsa.illinois.edu/jira/browse/CCROP-242)

### Changed
- Text on analysis page related to date selection. [CCROP-246](https://opensource.ncsa.illinois.edu/jira/browse/CCROP-246)
- Calculate cover crop termination date based on cash crop planting date. [CCROP-244](https://opensource.ncsa.illinois.edu/jira/browse/CCROP-244)
- Refactored dashboard components to make graph more legible [CCROP-245](https://opensource.ncsa.illinois.edu/jira/browse/CCROP-245)

### Removed
- Flexible dates check box from analysis page, related handler methods, and relevant code. [CCROP-246](https://opensource.ncsa.illinois.edu/jira/browse/CCROP-246)

## [0.4.0] - 2019-11-22

### Added
- Dashboard page that displays results of C:N and Biomass in time series. Other results on the harvest date are shown in a table. [CCROP-209](https://opensource.ncsa.illinois.edu/jira/browse/CCROP-209)

### Changed
- Included Tillage information in Crop History section of summary page [CCROP-188](https://opensource.ncsa.illinois.edu/jira/browse/CCROP-188)
- Disabled Job History Page
- Replaced hashHistory with browserHistory [CCROP-217](https://opensource.ncsa.illinois.edu/jira/browse/CCROP-217)

### Fixed
- Show planting and harvest dates on job cards used in dashboard [CROP-219](https://opensource.ncsa.illinois.edu/jira/browse/CCROP-219)

## [0.3.0] - 2019-03-06

### Added

- User can view and modify tillage on MyFarm crop history page [CCROP-180](https://opensource.ncsa.illinois.edu/jira/browse/CCROP-180)
- User can add new fertilizer entry on MyFarm crop history page and modify planting, harvest, etc [CCROP-156](https://opensource.ncsa.illinois.edu/jira/browse/CCROP-156)
- Populate default farm data when user adds a CLU [CCROP-134](https://opensource.ncsa.illinois.edu/jira/browse/CCROP-134)

### Changed
- Download link on My Farm Summary page to point to the DSSAT sequence file (.SQX) of the field. [CCROP-179](https://opensource.ncsa.illinois.edu/jira/browse/CCROP-179)
- Summary page built from SQX data associated with a farm using service SQX endpoint [CCROP-148](https://opensource.ncsa.illinois.edu/jira/browse/CCROP-148)

### Fixed
- When a user logs in, redirect to the start a job page [CCROP-159](https://opensource.ncsa.illinois.edu/jira/browse/CCROP-159)
- Run simulation button not responding to button press [CCROP-165](https://opensource.ncsa.illinois.edu/jira/browse/CCROP-165)

## [0.2.0] - 2018-10-12

### Added
- User can run any field with default template data
- Display farm data on MyFarm page [CCROP-102](https://opensource.ncsa.illinois.edu/jira/browse/CCROP-102)
- User can modify fertilizer application on MyFarm page [CCROP-115](https://opensource.ncsa.illinois.edu/jira/browse/CCROP-115)
- Added Cover crop selection to simulation page [CCROP-114](https://opensource.ncsa.illinois.edu/jira/browse/CCROP-114)

### Changed

- Map is now responsive to user's defined fields [CCROP-107](https://opensource.ncsa.illinois.edu/jira/browse/CCROP-107)
- History page uses pagination [CCROP-110](https://opensource.ncsa.illinois.edu/jira/browse/CCROP-110)
- User is warned if they have already defined a field [CCROP-96](https://opensource.ncsa.illinois.edu/jira/browse/CCROP-96)
- Updated to use shared resources [CCROP-101](https://opensource.ncsa.illinois.edu/jira/browse/CCROP-101)
- Updated dependencies [CCROP-127](https://opensource.ncsa.illinois.edu/jira/browse/CCROP-127)


### Fixed

## [0.1.0] - 2018-03-09

Initial release of Cover Crop.
