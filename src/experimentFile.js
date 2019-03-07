export const drainage_type = {
	"DR000": "No drainage",
	"DR001": "Ditches",
	"DR002": "Sub-surface tiles",
	"DR003": "Surface furrows"
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

export const defaultFertilizer = {
	"FDATE": "0402",
	// "FMCD": "FE004",
	"FACD": "AP009",
	"FDEP": "20",
	"FAMN": "193",
};

export const PLDS = {"R": "Row", "B": "Broadcast"};
export const TIMPL = {
	"None": "No Tillage", "TI002": "Subsoiler", "TI003": "Moldboard plow",
	"TI004": "Chisel plow, sweeps", "TI005": "Chisel plow, straight point", "TI006": "Chisel plow, twisted shovels",
	"TI007": "Disk plow", "TI008": "Disk, 1-way", "TI009": "Disk, tandem", "TI010": "Disk, double disk",
	"TI011": "Cultivator, field", "TI012": "Cultivator, row", "TI014": "Harrow, spike", "TI015": "Harrow, tine",
	"TI019": "Fertilizer applicator, anhydrous"
};

export const defaultTillage = {"TDATE": "0922", "TDEP": "15"};
export const CR = {"MZ": "Corn", "SB": "Soybean", "FA": "Fallow"};
export const CROP = ["Corn", "Soybean", "Fallow"];
export const CULTIVARS = ["NEWTON", "DEKALB 591", "M GROUP 2", "2500-2600 GDD", "Fallow"];
