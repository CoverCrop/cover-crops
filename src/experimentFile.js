export const CURR_YEAR = (new Date()).getFullYear();
export const START_YEAR = 2015;

export const CULTIVARS = {"WH": "IB0488 NEWTON", "MZ": "DEKALB 591", "SB": "M GROUP 2", "FA": "FALLOW"};

export const drainage_type = {
	"DR002": "Sub-surface tiles",
	"DR000": "No drainage",
	// "DR001": "Ditches",
	// "DR003": "Surface furrows"
};

//Fertilizer material code
export const FMCD = {
	"None": "None",
	"FE001": "Ammonium nitrate",
	"FE002": "Ammonium sulfate",
	"FE004": "Anhydrous ammonia",
	"FE005": "Urea",
	"FE006": "Diammnoium phosphate",
	"FE007": "Monoammonium phosphate",
	"FE010": "Urea ammonium nitrate solution"
};

export const FACD = {
	"AP001": "Broadcast, not incorporated", "AP002": "Broadcast, incorporated",
	"AP004": "Banded beneath surface", "AP009": "Injected"
};

// All fertilizer defaults should be in SI units. This is different to planting & tillage
// defaults due to different implementation of default value parsing in the Fertilizer component.
export const defaultFertilizer = {
	"FDATE": "0402",
	// "FMCD": "FE004",
	"FACD": "AP009",
	"FDEP": "20.00",
	"FAMN": "193.0"
};

// All planting defaults should be in Imperial format
export const defaultCashcropPlanting = {
	// "PDATE":"0513",
	"PPOP": "32000",
	"PPOE": "32000",
	"PLME": "S",
	"PLDS": "R",
	"PLRS": "29.92",
	"PLRD": "0",
	"PLDP": "1.57"
};

export const defaultCovercropPlanting = {
	// "PDATE":"0513",
	"PPOP": "900000",
	"PPOE": "900000",
	"PLME": "S",
	"PLDS": "R",
	"PLRS": "7.50",
	"PLRD": "0",
	"PLDP": "1.50"
};

export const defaultHarvest = {
	"HDATE": "0928"
};

export const PLDS = {"R": "Row", "B": "Broadcast"};
export const TIMPL = {
	"None": "No Tillage", "TI002": "Subsoiler", "TI003": "Moldboard plow",
	"TI004": "Chisel plow, sweeps", "TI005": "Chisel plow, straight point", "TI006": "Chisel plow, twisted shovels",
	"TI007": "Disk plow", "TI008": "Disk, 1-way", "TI009": "Disk, tandem", "TI010": "Disk, double disk",
	"TI011": "Cultivator, field", "TI012": "Cultivator, row", "TI014": "Harrow, spike", "TI015": "Harrow, tine",
	"TI019": "Fertilizer applicator, anhydrous"
};

export const defaultTillage = {"TDATE": "0922", "TDEP": "5.91"}; // default in SI
// export const CROP = {"MZ": "Corn", "SB": "Soybean", "FA": "Fallow"};
export const cashCrops = ["Corn", "Soybean"];
export const coverCrops = ["Rye"];
// TODO: Re-introduce "None" option below after fixing gap filling.
export const cashCropOptions = cashCrops.concat([]);
export const coverCropOptions = coverCrops.concat(["None"]);
export const defaultCropYears = ["2015", "2016", "2017", "2018", "2019", "2020"];
export const cultivars = {"Corn": "DEKALB 591", "Soybean": "M GROUP 2", "Rye": "IB0488 NEWTON", "None": "None"};

// actual inch limit should have been 393, but 385 is the max value where rounding error does not occur
export const INCH_LIMIT = 385;
export const LBS_LIMIT = 892;
export const SEEDS_LIMIT = 10000000;
export const SEEDS_ROUND_TO = 1000;
