var getLocalization = function () {
     var localizationobj = {};
     localizationobj.pagergotopagestring = "頁數:";
     localizationobj.pagershowrowsstring = "一頁顯示:";
     localizationobj.pagerrangestring = " 共 ";
     localizationobj.pagernextbuttonstring = "下一頁";
     localizationobj.pagerpreviousbuttonstring = "上一頁";
     localizationobj.sortascendingstring = "遞增排序";
     localizationobj.sortdescendingstring = "遞減排序";
     localizationobj.sortremovestring = "取消排序";
     localizationobj.firstDay = 1;
     localizationobj.percentsymbol = "%";
     localizationobj.currencysymbol = "NT $";
     localizationobj.currencysymbolposition = "after";
     localizationobj.decimalseparator = ".";
     localizationobj.thousandsseparator = ",";
     var days = {
         // full day names
         names: ["週日", "週一", "週二", "週三", "週四", "週五", "週六"],
         // abbreviated day names
         namesAbbr: ["Sun", "Mon", "Tue", "Wed", "Thr", "Fri", "Sat"],
         // shortest day names
         namesShort: ["週日", "週一", "週二", "週三", "週四", "週五", "週六"]
     };
     localizationobj.days = days;
     var months = {
         // full month names (13 months for lunar calendards -- 13th month should be "" if not lunar)
         names: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月", ""],
         // abbreviated month names
         namesAbbr: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月", ""]
     };
     var patterns = {
         d: "dd.MM.yyyy",
         D: "dddd, d. MMMM yyyy",
         t: "HH:mm",
         T: "HH:mm:ss",
         f: "dddd, d. MMMM yyyy HH:mm",
         F: "dddd, d. MMMM yyyy HH:mm:ss",
         M: "dd MMMM",
         Y: "MMMM yyyy"
     }
     localizationobj.patterns = patterns;
     localizationobj.months = months;
     localizationobj.todaystring = "當日";
     localizationobj.clearstring = "清除";
     return localizationobj;
 }