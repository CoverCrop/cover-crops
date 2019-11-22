# Change Log
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

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
