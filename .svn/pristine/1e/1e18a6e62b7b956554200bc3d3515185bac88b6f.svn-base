package library.dateutility;

import java.sql.Timestamp;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;

public class Transform {

    /**
     * 將民國年日期字串轉為 java.util.Date
     *
     * @param ROC_DATE:民國年日期 （1060101）
     *
     * @return Date return_D (java.util.Date)
     *
     * @exception n/a
     */
    public static Date ROCDateStringToDate(String ROC_DATE) throws ParseException {
        // TimaMenu.getLog().info("ROC_DATE 字串內容為:" + ROC_DATE);
        Date return_D = null;
        String subStr = ROC_DATE;
        // String subYYY = subStr.substring(0, 3);
        // TimaMenu.getLog().info("從第0取到第3個之前字串內容為:"+subYYY);
        // String subMMDD = subStr.substring(3, 7);
        // TimaMenu.getLog().info("從第3到第7個之前字串內容為:"+subMMDD);
        String subyyyyMMdd = String.valueOf((Integer.valueOf(subStr.substring(0, 3)) + 1911)) + subStr.substring(3);
        // TimaMenu.getLog().info("subyyyyMMdd:"+subyyyyMMdd);

        SimpleDateFormat sdFormat = new SimpleDateFormat("yyyyMMdd");
        return_D = sdFormat.parse(subyyyyMMdd);
        // TimaMenu.getLog().info(return_D);

        return return_D;

    }

    /**
     * 將民國年日期時間字串轉為 java.util.Date
     *
     * @param String ROC_DATE_TIME:民國年日期時間 （10601011230）
     *
     * @return Date return_D (java.util.Date)
     *
     * @exception n/a
     */
    public static Date ROCDateTimeStringToDate(String ROC_DATE_TIME) throws ParseException {
        // TimaMenu.getLog().info("ROC_DATE_TIME 字串內容為:" + ROC_DATE_TIME);
        Date return_D = null;
        String subStr = ROC_DATE_TIME;
        String subyyyyMMddHHmm = String.valueOf((Integer.valueOf(subStr.substring(0, 3)) + 1911)) + subStr.substring(3);
        // TimaMenu.getLog().info("subYYYYMMDDHHMM:" + subyyyyMMddHHmm);

        SimpleDateFormat sdFormat = new SimpleDateFormat("yyyyMMddHHmm");
        return_D = sdFormat.parse(subyyyyMMddHHmm);
        // TimaMenu.getLog().info(return_D);

        return return_D;

    }

    /**
     * 將民國年日期時間字串轉為 java.util.Date(包含秒)
     *
     * @param String ROC_DATE_TIME:民國年日期時間 （10601011230）
     *
     * @return Date return_D (java.util.Date)
     *
     * @exception n/a
     */
    public static Date ROCDateTimeSStringToDate(String ROC_DATE_TIMESS) throws ParseException {
        Date return_D = null;
        String subStr = ROC_DATE_TIMESS;
        String subyyyyMMddHHmmss = String.valueOf((Integer.valueOf(subStr.substring(0, 3)) + 1911)) + subStr.substring(3);

        SimpleDateFormat sdFormat = new SimpleDateFormat("yyyyMMddHHmmss");
        return_D = sdFormat.parse(subyyyyMMddHHmmss);
        // TimaMenu.getLog().info(return_D);

        return return_D;

    }

    /**
     * 將民國年日期字串轉為 Timestamp
     *
     * @param String ROC_DATE:民國年日期 （1060101）
     *
     * @return Timestamp return_T (java.sql.Timestamp)
     *
     * @exception n/a
     */
    public static Timestamp ROCDateStringToTimestamp(String ROC_DATE) throws ParseException {
        Calendar cal = Calendar.getInstance();
        cal.setTime(Transform.ROCDateStringToDate(ROC_DATE));
        long time1 = cal.getTimeInMillis();
        Timestamp return_T=new Timestamp(time1);

        return return_T;

    }

    /**
     * 將民國年日期時間字串轉為 Timestamp
     *
     * @param String ROC_DATETIME:民國年日期 （1060101100000）(106/01/01 10:00:00)
     *
     * @return Timestamp return_T (java.sql.Timestamp)
     *
     * @exception n/a
     */
    public static Timestamp ROCDateTimeStringToTimestamp(String ROC_DATETIME) throws ParseException {
        Calendar cal = Calendar.getInstance();
        cal.setTime(Transform.ROCDateTimeStringToDate(ROC_DATETIME));
        long time1 = cal.getTimeInMillis();
        Timestamp return_T=new Timestamp(time1);

        return return_T;

    }


    /**
     * 將 java.util.Date 轉為民國年日期字串
     *
     * @param Date input_D (java.util.Date)
     *
     * @return String subyyyMMdd:民國年日期 （1060101）
     *
     * @exception n/a
     */
    public static String DateToROCDateString(Date input_D) throws ParseException {
        // TimaMenu.getLog().info("DATE 內容為:" + input_D);
        // 設定日期格式
        SimpleDateFormat sdFormat = new SimpleDateFormat("yyyyMMdd");
        // 進行轉換
        String dateString = sdFormat.format(input_D);
        // TimaMenu.getLog().info("轉換結果 dateString:" + dateString);
        String formatStr = "%03d";// 3位數數字左方補0格式化
        String subyyyMMdd = String.format(formatStr, (Integer.valueOf(dateString.substring(0, 4)) - 1911))
                + dateString.substring(4);
        // TimaMenu.getLog().info("轉換結果 ROCDateString:" + subyyyMMdd);
        return subyyyMMdd;

    }

    /**
     * 將 java.util.Date 轉為民國年日期時間字串
     *
     * @param Date input_D (java.util.Date)
     *
     * @return String subyyyMMddHHmm 民國年日期時間 （10601011230）
     *
     * @exception n/a
     */
    public static String DateToROCDateTimeString(Date input_D) throws ParseException {
        // TimaMenu.getLog().info("DATE 內容為:" + input_D);
        // 設定日期格式
        SimpleDateFormat sdFormat = new SimpleDateFormat("yyyyMMddHHmm");
        // 進行轉換
        String dateTimeString = sdFormat.format(input_D);
        // TimaMenu.getLog().info("轉換結果 dateString:" + dateTimeString);
        String formatStr = "%03d";// 3位數數字左方補0格式化
        String subyyyMMddHHmm = String.format(formatStr, (Integer.valueOf(dateTimeString.substring(0, 4)) - 1911))
                + dateTimeString.substring(4);
        // TimaMenu.getLog().info("轉換結果 ROCDateTimeString:" + subyyyMMddHHmm);

        return subyyyMMddHHmm;

    }

    /**
     * 將西元年日期字串轉為 java.util.Date
     *
     * @param String AD_DATE:西元年日期 （20161101）
     *
     * @return Date return_D (java.util.Date)
     *
     * @exception n/a
     */
    public static Date ADDateStringToDate(String AD_DATE) throws ParseException {
        // TimaMenu.getLog().info("AD_DATE 字串內容為:" + AD_DATE);
        Date return_D = null;
        SimpleDateFormat sdFormat = new SimpleDateFormat("yyyyMMdd");
        return_D = sdFormat.parse(AD_DATE);
        // TimaMenu.getLog().info(return_D);
        return return_D;

    }

    /**
     * 將西元年日期時間字串轉為 java.util.Date
     *
     * @param String AD_DATE_TIME:西元年日期時間 （201611011230）
     *
     * @return Date return_D (java.util.Date)
     *
     * @exception n/a
     */
    public static Date ADDateTimeStringToDate(String AD_DATE_TIME) throws ParseException {
        // TimaMenu.getLog().info("AD_DATE_TIME 字串內容為:" + AD_DATE_TIME);
        Date return_D = null;
        SimpleDateFormat sdFormat = new SimpleDateFormat("yyyyMMddHHmm");
        return_D = sdFormat.parse(AD_DATE_TIME);
        // TimaMenu.getLog().info(return_D);
        return return_D;

    }

    /*
     * 將 java.util.Date 轉為西元年日期字串
     *
     * @param Date input_D (java.util.Date)
     *
     * @return String dateTimeString 西元年日期 （20161101）
     *
     * @exception n/a
     */
    public static String DateToADDateString(Date input_D) throws ParseException {
        // TimaMenu.getLog().info("DATE 內容為:" + input_D);
        // 設定日期格式
        SimpleDateFormat sdFormat = new SimpleDateFormat("yyyyMMdd");
        // 進行轉換
        String dateString = sdFormat.format(input_D);
        // TimaMenu.getLog().info("轉換結果 dateString:" + dateString);
        return dateString;

    }

    /*
     * 將 java.util.Date 轉為西元年日期時間字串
     *
     * @param Date input_D (java.util.Date)
     *
     * @return String dateTimeString 西元年日期時間 （201611011230）
     *
     * @exception n/a
     */
    public static String DateToADDateTimeString(Date input_D) throws ParseException {
        // TimaMenu.getLog().info("DATE 內容為:" + input_D);
        // 設定日期格式
        SimpleDateFormat sdFormat = new SimpleDateFormat("yyyyMMddHHmm");
        // 進行轉換
        String dateTimeString = sdFormat.format(input_D);
        // TimaMenu.getLog().info("轉換結果 dateString:" + dateTimeString);
        return dateTimeString;

    }

    /*
     * 將民國年日期字串轉 YYY/MM/DD
     *
     * @param String ROC_DATE:民國年日期 （1060101）
     *
     * @return String Formated_ROC_DATE:民國年日期 （106/01/01）
     *
     * @exception n/a
     */
    public static String ROCDateStringFormat(String ROC_DATE) throws ParseException {
        // TimaMenu.getLog().info("ROC_DATE 字串內容為:" + ROC_DATE);
        String formatedStr = ROC_DATE.substring(0, 3) + "/" + ROC_DATE.substring(3, 5) + "/" + ROC_DATE.substring(5);
        // TimaMenu.getLog().info("ROCDateStringFormat 字串內容為:" +formatedStr);
        return formatedStr;

    }

    /*
     * 將民國年日期時間字串轉 YYY/MM/DD HH:MM
     *
     * @param String ROC_DATE:民國年日期 （10601011230）
     *
     * @return String Formated_ROC_DATE:民國年日期 （106/01/01 12:30）
     *
     * @exception n/a
     */
    public static String ROCDateTimeStringFormat(String ROC_DATE_TIME) throws ParseException {
        // TimaMenu.getLog().info("ROC_DATE_TIME 字串內容為:" + ROC_DATE_TIME);
        String formatedStr = ROC_DATE_TIME.substring(0, 3) + "/" + ROC_DATE_TIME.substring(3, 5) + "/"
                + ROC_DATE_TIME.substring(5, 7) + " " + ROC_DATE_TIME.substring(7, 9) + ":"
                + ROC_DATE_TIME.substring(9);
        // TimaMenu.getLog().info("ROCDateTimeStringFormat 字串內容為:"+formatedStr);
        return formatedStr;
    }

    /*
     * 將西元年日期字串轉 yyyy/MM/DD
     *
     * @param String AD_DATE:民國年日期 （20160101）
     *
     * @return String formatedStr:西元年日期 （2016/01/01）
     *
     * @exception n/a
     */
    public static String ADDateStringFormat(String AD_DATE) throws ParseException {
        // TimaMenu.getLog().info("AD_DATE 字串內容為:" + AD_DATE);
        String formatedStr = AD_DATE.substring(0, 4) + "/" + AD_DATE.substring(4, 6) + "/" + AD_DATE.substring(6);
        // TimaMenu.getLog().info("ADDateStringFormat 字串內容為:" +formatedStr);
        return formatedStr;

    }

    /*
     * 將西元年日期時間字串轉 yyyy/MM/DD HH:MM
     *
     * @param String AD_DATE:西元年日期 （201601011230）
     *
     * @return String formatedStr:西元年日期時間 （2016/01/01 12:30）
     *
     * @exception n/a
     */
    public static String ADDateTimeStringFormat(String AD_DATE_TIME) throws ParseException {
        // TimaMenu.getLog().info("AD_DATE_TIME 字串內容為:" + AD_DATE_TIME);
        String formatedStr = AD_DATE_TIME.substring(0, 4) + "/" + AD_DATE_TIME.substring(4, 6) + "/"
                + AD_DATE_TIME.substring(6, 8) + " " + AD_DATE_TIME.substring(8, 10) + ":" + AD_DATE_TIME.substring(10);
        // TimaMenu.getLog().info("ADDateTimeStringFormat 字串內容為:"+formatedStr);
        return formatedStr;
    }



    /*
     * 將民國年日期字串轉為西元年日期字串
     *
     * @param String ROC_DATE:民國年日期 （1060101）
     *
     * @return String AD_DATE:民國年日期 （20170101）
     *
     * @exception n/a
     */
    public static String ROCDateStringToADDateString(String ROC_DATE) throws ParseException {
        // TimaMenu.getLog().info("ROC_DATE 字串內容為:" + ROC_DATE);
        String subStr = ROC_DATE;
        String AD_DATE = String.valueOf((Integer.valueOf(subStr.substring(0, 3)) + 1911)) + subStr.substring(3);
        // TimaMenu.getLog().info("AD_DATE 字串內容為:" + AD_DATE);
        return AD_DATE;
    }

    /*
     * 將西元年日期字串轉為民國年日期字串
     *
     * @param String AD_DATE:民國年日期 （20170101）
     *
     * @return String ROC_DATE:民國年日期 （1060101）
     *
     * @exception n/a
     */
    public static String ADDateStringToROCDateString(String AD_DATE) throws ParseException {
        // TimaMenu.getLog().info("AD_DATE 字串內容為:" + AD_DATE);
        String subStr = AD_DATE;
        String formatStr = "%03d";// 3位數數字左方補0格式化
        String ROC_DATE = String.format(formatStr, (Integer.valueOf(subStr.substring(0, 4)) - 1911))
                + subStr.substring(4);
        // TimaMenu.getLog().info("ROC_DATE 字串內容為:" + ROC_DATE);
        return ROC_DATE;
    }

}
