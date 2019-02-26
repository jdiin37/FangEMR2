package library.dateutility;


import java.util.Date;

public class TwoDate {

    private Date date1 = null;
    private Date date2 = null;
    private int day;
    private int month;
    private int year;
    private int yearD;
    private long diff;
    private long diffMinutes;

    public TwoDate(String ROC_DATE1, String ROC_DATE2) throws Exception {
    	this(Transform.ROCDateStringToDate(ROC_DATE1), Transform.ROCDateStringToDate(ROC_DATE2));
    }    
    
    public TwoDate(Date date1, Date date2) {
        this.date1 = date1;
        this.date2 = date2;
        diff = date2.getTime() - date1.getTime();
        diffMinutes = diff / (60 * 1000);

        year = Utility.Year(date2) - Utility.Year(date1);
        yearD = year;
        month = Utility.Month(date2) - Utility.Month(date1);
        day = Utility.Day(date2) - Utility.Day(date1);
        if (day < 0) {
            day += Utility.Day(Utility.getMonthLastDay(date1));
            month -= 1;
        }
        if (month < 0) {
            month += 12;
            year -= 1;
        }
    }

    /**
     * 取得差幾年 
     * @return 
     */
    public int Year() {
        return year;
    }

    /**
     * 取得差幾年-- 年減年
     * @return 
     */
    public int YearD() {
        return yearD;
    }

    /**
     * 取得差幾月 1~12
     * @return 
     */
    public int Month() {
        return month;
    }

    /**
     * 取得差幾個月分 Year*12 + Month
     * @return 
     */
    public int MonthS() {
        return year * 12 + month;
    }

    /**
     * 取得差幾天  0~30
     * @return 
     */
    public int Day() {
        return day;
    }

    /**
     * 取得差總共天數  0~30
     * @return 
     */
    public int DayS() {
        return (int) diffMinutes / (60 * 24);
    }

    public int HourS() {
        return (int) diffMinutes / 60;
    }

    public int MinuteS() {
        return (int) diffMinutes / 60;
    }

    public String getDefFormatAge() {
        return "" + year + "y " + month + "m " + day + "d";
    }

    public String getDistPedAdultAge() {
        if (year < 1) {
            return "" + month + "m " + day + "d";
        } else if (year < 16) {
            return "" + year + "y " + month + "m " + day + "d";
        } else {
            return "" + year + "y " + month + "m ";
        }

    }
}
