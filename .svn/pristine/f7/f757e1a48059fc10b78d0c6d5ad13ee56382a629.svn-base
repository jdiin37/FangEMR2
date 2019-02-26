package library.dateutility;

import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.GregorianCalendar;

public class Utility {
	public static enum DATE_CATEGORIES {

		YEAR, MONTH, DAY, HOUR, MINUTE;
	}

	/**
	 * 回傳日期整數
	 * 如果 DATE_CATEGORIES=YEAR,則取得當年第一天; 
	 * 如果 DATE_CATEGORIES=MONTH,則取得當月第一天
	 * 如果 DATE_CATEGORIES=DAY,則取得當天日期並將時分秒歸零
	 * 如果 DATE_CATEGORIES=HOUR,則取得當天當小時並將分秒歸零
	 * 如果 DATE_CATEGORIES=MINUTE,則取得當天當小時當分並將秒歸零
	 * 
	 * @param fromDategories
	 *            類別 YEAR，MONTH,DAY,HOUR,MINUTE
	 * @param fromDate
	 * @return Date
	 * @auth curson
	 */
	public static Date truncate(DATE_CATEGORIES fromDategories, Date fromDate) {
		if (fromDate == null) {
			return null;
		}
		Calendar cal = Calendar.getInstance();
		cal.setTime(fromDate);
		switch (fromDategories) {
		case YEAR:
			cal.set(Calendar.DAY_OF_YEAR, 1);
			cal.set(Calendar.HOUR_OF_DAY, 0);
			cal.set(Calendar.MINUTE, 0);
			cal.set(Calendar.SECOND, 0);
			cal.set(Calendar.MILLISECOND, 0);
			break;
		case MONTH:
			cal.set(Calendar.DAY_OF_MONTH, 1);
			cal.set(Calendar.HOUR_OF_DAY, 0);
			cal.set(Calendar.MINUTE, 0);
			cal.set(Calendar.SECOND, 0);
			cal.set(Calendar.MILLISECOND, 0);
			break;
		case DAY:
			cal.set(Calendar.HOUR_OF_DAY, 0);
			cal.set(Calendar.MINUTE, 0);
			cal.set(Calendar.SECOND, 0);
			cal.set(Calendar.MILLISECOND, 0);
			break;
		case HOUR:
			cal.set(Calendar.MINUTE, 0);
			cal.set(Calendar.SECOND, 0);
			cal.set(Calendar.MILLISECOND, 0);
			break;
		case MINUTE:
			cal.set(Calendar.SECOND, 0);
			cal.set(Calendar.MILLISECOND, 0);
			break;
		default:
			;
		}
		return cal.getTime();
	}

	public static Date truncate(Date fromDate) {
		return truncate(DATE_CATEGORIES.DAY, fromDate);
	}

	/**
	 * 二個日期區間是否有重疊
	 * 
	 * @param fromDateS1
	 *            Start Date 1
	 * @param fromDateE1
	 *            End Date 1
	 * @param fromDateS2
	 *            Start Date 2
	 * @param fromDateE2
	 *            End Date 2
	 * @return
	 */
	public static boolean isOverlap(Date fromDateS1, Date fromDateE1, Date fromDateS2, Date fromDateE2) {
		if (fromDateS1.compareTo(fromDateE2) <= 0 && fromDateE1.compareTo(fromDateS2) >= 0) {
			return true;
		}
		return false;
	}

	public static boolean isOverlap(String fromDateS1, String fromDateE1, String fromDateS2, String fromDateE2) {
		try {
			return isOverlap(Transform.ROCDateStringToDate(fromDateS1), Transform.ROCDateStringToDate(fromDateE1),
					Transform.ROCDateStringToDate(fromDateS2), Transform.ROCDateStringToDate(fromDateE2));
		} catch (ParseException e) {

			e.printStackTrace();
		}
		return false;
	}

	/**
	 * 傳入日期及要加減的天數,回傳Date型別
	 *
	 * <pre>
	 * 傳入範例
	 * {@code
	 * Example1 : Date myDate = chartObjEX.strToDate(myDate,2);//回傳日期加2天
	 * Example2 : Date myDate = chartObjEX.strToDate(myDate,-7);//回傳日期減7天
	 * }
	 * </pre>
	 */
	public static Date addDayToDate(Date inDate, int day) {
		Date date = inDate;
		if (date == null) {
			return inDate;
		}
		Calendar calendar = new GregorianCalendar();
		calendar.setTime((Date) date.clone());
		calendar.add(calendar.DATE, day);
		date = calendar.getTime();
		return date;
	}

	public static String addDayToDate(String inDate, int day) {
		String date = null;
		try {
			date = Transform.DateToROCDateString(addDayToDate(Transform.ROCDateStringToDate(inDate), day));
		} catch (ParseException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return date;
	}

	/**
	 * 傳入日期及要加減的月份,回傳Date型別
	 * 注意大小月份，如果小月沒有的日期（如2月30）會傳回小月最後一天
	 * @param inDate
	 *            日期
	 * @param month
	 *            要算的月份
	 * @return 傳回Date
	 */
	public static Date addMonthToDate(Date inDate, int month) {
		Date date = inDate;
		if (date == null) {
			return inDate;
		}
		Calendar calendar = new GregorianCalendar();
		calendar.setTime(date);
		calendar.add(Calendar.MONTH, month);
		date = calendar.getTime();
		return date;
	}

	public static String addMonthToDate(String inDate, int month) {
		String date = null;
		try {
			date = Transform.DateToROCDateString(addMonthToDate(Transform.ROCDateStringToDate(inDate), month));
		} catch (ParseException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return date;
	}

	public static int Year(Date date) {
		Calendar calendar = new GregorianCalendar();
		calendar.setTime(date);
		return calendar.get(Calendar.YEAR);
	}

	public static int Month(Date date) {
		Calendar calendar = new GregorianCalendar();
		calendar.setTime(date);
		return calendar.get(Calendar.MONTH);
	}

	public static int Day(Date date) {
		Calendar calendar = new GregorianCalendar();
		calendar.setTime(date);
		return calendar.get(Calendar.DAY_OF_MONTH);
	}

	/*
	 * 取得 Compute date 三缺一（fromDateS, toDateS, days)
	 * 
	 * @param String fromDateS, toDateS, days
	 * 
	 * @return String fromDate/toDate/days(都以 String傳回)
	 * 
	 * @exception n/a
	 */
	public static String computeDate(String fromDateS, String toDateS, Integer days) throws Exception {
		String returnStr = "";
		if (days == null) {
			fromDateS = Transform.ROCDateStringToADDateString(fromDateS);
			toDateS = Transform.ROCDateStringToADDateString(toDateS);
			days = daysBetween(fromDateS, toDateS);
			returnStr = days.toString();
		}
		if (toDateS == null) {
			fromDateS = Transform.ROCDateStringToADDateString(fromDateS);// 先轉成西元
			DateFormat dateFormat = new SimpleDateFormat("yyyyMMdd");
			Calendar calendar = Calendar.getInstance();
			calendar.setTime(dateFormat.parse(fromDateS));
			calendar.set(Calendar.DATE, calendar.get(Calendar.DATE) + days);
			String date_AD = dateFormat.format(calendar.getTime());
			returnStr = Transform.ADDateStringToROCDateString(date_AD);// 再轉回民國
		}
		if (fromDateS == null) {
			toDateS = Transform.ROCDateStringToADDateString(toDateS);// 先轉成西元
			DateFormat dateFormat = new SimpleDateFormat("yyyyMMdd");
			Calendar calendar = Calendar.getInstance();
			calendar.setTime(dateFormat.parse(toDateS));
			calendar.set(Calendar.DATE, calendar.get(Calendar.DATE) - days);
			String date_AD = dateFormat.format(calendar.getTime());
			returnStr = Transform.ADDateStringToROCDateString(date_AD);// 再轉回民國
		}
		return returnStr;
	}

	/**
	 * 回傳二個日期區間之交集
	 * 
	 * @param fromDategories
	 * @param fromDateS1
	 * @param fromDateE1
	 * @param fromDateS2
	 * @param fromDateE2
	 * @return
	 * @auth curson
	 */
	public static long getDateIntersection(DATE_CATEGORIES fromDategories, Date fromDateS1, Date fromDateE1,
			Date fromDateS2, Date fromDateE2) {
		long ret = 0;
		if (fromDateS2.before(fromDateS1) || fromDateS2.equals(fromDateS1)) {
			if (fromDateE2.after(fromDateE1) || fromDateE2.equals(fromDateE1)) {
				// Step 1
				// S1----E1
				// S2----------E2
				ret = getDateDiff(fromDategories, fromDateS1, fromDateE1);
			} else {
				// Step2
				// S1-------------E1
				// S2----------E2
				// or
				// S1-------------E1
				// S2----------E2
				ret = getDateDiff(fromDategories, fromDateS1, fromDateE2);
			}
		} else {
			if (fromDateE2.before(fromDateE1) || fromDateE2.equals(fromDateE1)) {
				// Step 3
				// S1---------------------E1
				// S2----------E2
				ret = getDateDiff(fromDategories, fromDateS2, fromDateE2);
			} else {
				// Step 4
				// S1---------------------E1
				// S2----------E2
				// or
				// Step 4
				// S1---------------------E1
				// S2----------E2
				ret = getDateDiff(fromDategories, fromDateS2, fromDateE1);

			}
		}

		return ret;
	}

	/**
	 * 回傳二個日期區間之交集 分鐘數
	 * 
	 * @param fromDateS1
	 * @param fromDateE1
	 * @param fromDateS2
	 * @param fromDateE2
	 * @return 二個日期區間之交集 分鐘數
	 * 
	 * @auth curson
	 */
	public static long getDateIntersection(Date fromDateS1, Date fromDateE1, Date fromDateS2, Date fromDateE2) {
		return getDateIntersection(DATE_CATEGORIES.MINUTE, fromDateS1, fromDateE1, fromDateS2, fromDateE2);
	}

	/**
	 * 取得實歲年齡
	 * 
	 * @param Date
	 *            birthDay, Date baseDay
	 * 
	 * @return int
	 * 
	 * @exception n/a
	 */
	public static int getRealAge(Date birthDay, Date baseDay) throws Exception {
		Calendar calBirth = Calendar.getInstance();
		Calendar calBase = Calendar.getInstance();
		calBirth.setTime(birthDay);
		calBase.setTime(baseDay);

		int age = calBase.get(Calendar.YEAR) - calBirth.get(Calendar.YEAR);
		// 判斷年紀只有這裡要注意，就是今年的生日過了沒，沒過就少算一歲。
		calBirth.set(Calendar.YEAR, calBase.get(Calendar.YEAR));
		if (calBase.getTime().getTime() < calBirth.getTime().getTime()) {
			age--;
		}
		return age;
	}

	public static int getRealAge(String birthDay, String baseDay) throws Exception {
		int age = getRealAge(Transform.ROCDateStringToDate(birthDay), Transform.ROCDateStringToDate(baseDay));
		return age;
	}

	/**
	 * 取得兩日期間的實際月數
	 * 
	 * @param Date
	 *            inputDay, Date baseDay(現在參考日期)
	 * 
	 * @return int
	 * 
	 * @exception n/a
	 */
	public static int getRealMonth(Date inputDay, Date baseDay) throws Exception {
		Calendar calInput = Calendar.getInstance();
		Calendar calBase = Calendar.getInstance();
		calInput.setTime(inputDay);
		calBase.setTime(baseDay);

		int months = (calBase.get(Calendar.YEAR) - calInput.get(Calendar.YEAR)) * 12
				+ (calBase.get(Calendar.MONTH) - calInput.get(Calendar.MONTH));
		// 判斷實際月數要注意，就是當月當日過了沒，沒過就少算一個月。
		calInput.set(Calendar.YEAR, calBase.get(Calendar.YEAR));
		calInput.set(Calendar.MONTH, calBase.get(Calendar.MONTH));
		if (calBase.getTime().getTime() < calInput.getTime().getTime()) {
			months--;
		}
		return months;
	}

	public static int getRealMonth(String inputDay, String baseDay) throws Exception {
		int months = getRealMonth(Transform.ROCDateStringToDate(inputDay), Transform.ROCDateStringToDate(baseDay));
		return months;
	}

	/**
	 * 取得 fromDateS~toDateS: days
	 * 
	 * @param String fromDateS, toDateS
	 * 
	 * @return Integer
	 * 
	 * @exception n/a
	 */

	public static Integer daysBetween(String fromDateS, String toDateS) throws ParseException {
		Calendar cal = Calendar.getInstance();
		cal.setTime(Transform.ROCDateStringToDate(fromDateS));
		long time1 = cal.getTimeInMillis();
		cal.setTime(Transform.ROCDateStringToDate(toDateS));
		long time2 = cal.getTimeInMillis();
		long between_days = (time2 - time1) / (1000 * 3600 * 24);
		return Integer.parseInt(String.valueOf(between_days));
	}

	public static Date getAddDate(DATE_CATEGORIES fromDateCategories, Date fromDate, int fromAdd) {
		Calendar cal = Calendar.getInstance();
		cal.setTime((Date) fromDate.clone());
		switch (fromDateCategories) {
		case YEAR:
			cal.add(Calendar.YEAR, fromAdd);
			break;
		case MONTH:
			cal.add(Calendar.MONTH, fromAdd);
			break;
		case DAY:
			cal.add(Calendar.DAY_OF_MONTH, fromAdd);
			break;
		case HOUR:
			cal.add(Calendar.HOUR_OF_DAY, fromAdd);
			break;
		case MINUTE:
			cal.add(Calendar.MINUTE, fromAdd);
			break;
		default:
			;
		}
		return cal.getTime();
	}

	/**
	 * 回傳日期區間之差異數
	 * 
	 * @param fromDategories
	 *            差異數之類別 YEAR，MONTH,DAY,HOUR,MINUTE 注意 YEAR是DAYS/365天所以會有誤差
	 *            MONTH 是DAYS/30天所以會有誤差
	 * @param fromDate1
	 * @param fromDate2
	 * @return
	 * @auth curson
	 */
	public static long getDateDiff(DATE_CATEGORIES fromDategories, Date fromDate1, Date fromDate2) {
		long diff = fromDate2.getTime() - fromDate1.getTime();
		long diffMinutes = diff / (60 * 1000);
		long ret = 0;
		switch (fromDategories) {
		case YEAR:
			ret = diffMinutes / (60 * 24 * 365);
			break;
		case MONTH:
			ret = diffMinutes / (60 * 24 * 30);
			break;
		case DAY:
			ret = diffMinutes / (60 * 24);
			break;
		case HOUR:
			ret = diffMinutes / 60;
			break;
		case MINUTE:
			ret = diffMinutes;
			break;
		default:
			;
		}
		return ret;
	}

	/**
	 * 取得西元年上個月(YYYYMM)
	 * 
	 * @param baseMonth
	 *            基準月
	 * @return yyyyMM
	 * @throws ParseException
	 */
	public static String getADLastMonth(String baseMonth) throws ParseException {
		DateFormat dateFormat = new SimpleDateFormat("yyyyMM");
		Calendar calendar = Calendar.getInstance();
		calendar.setTime(dateFormat.parse(baseMonth));
		calendar.set(Calendar.MONTH, calendar.get(Calendar.MONTH) - 1);
		return dateFormat.format(calendar.getTime());
	}

	/**
	 * 取得民國年上個月(YYYMM)
	 * 
	 * @param baseMonth
	 *            基準月
	 * @return yyyMM
	 * @throws ParseException
	 */
	public static String getLastMonth(String baseDay) throws ParseException {
		String baseDay_AD = Transform.ROCDateStringToADDateString(baseDay);// 先轉成西元
		DateFormat dateFormat = new SimpleDateFormat("yyyyMM");
		Calendar calendar = Calendar.getInstance();
		calendar.setTime(dateFormat.parse(baseDay_AD));
		calendar.set(Calendar.MONTH, calendar.get(Calendar.MONTH) - 1);
		String lastMonthDay_AD = dateFormat.format(calendar.getTime());
		return Transform.ADDateStringToROCDateString(lastMonthDay_AD);// 再轉回民國
	}

	/**
	 * 取得西元年下個月(YYYYMMDD)
	 * 
	 * @param baseMonth
	 *            基準月
	 * @return yyyyMM
	 * @throws ParseException
	 */
	public static String getADNextMonth(String baseMonth) throws ParseException {
		DateFormat dateFormat = new SimpleDateFormat("yyyyMM");
		Calendar calendar = Calendar.getInstance();
		calendar.setTime(dateFormat.parse(baseMonth));
		calendar.set(Calendar.MONTH, calendar.get(Calendar.MONTH) + 1);
		return dateFormat.format(calendar.getTime());
	}

	/**
	 * 取得民國年下個月(YYYMMDD)
	 * 
	 * @param baseMonth
	 *            基準月
	 * @return yyyMMdd
	 * @throws ParseException
	 */
	public static String getNextMonth(String baseMonth) throws ParseException {
		String baseDay_AD = Transform.ROCDateStringToADDateString(baseMonth);// 先轉成西元
		DateFormat dateFormat = new SimpleDateFormat("yyyyMM");
		Calendar calendar = Calendar.getInstance();
		calendar.setTime(dateFormat.parse(baseDay_AD));
		calendar.set(Calendar.MONTH, calendar.get(Calendar.MONTH) + 1);
		String lastMonthDay_AD = dateFormat.format(calendar.getTime());
		return Transform.ADDateStringToROCDateString(lastMonthDay_AD);// 再轉回民國
	}

	/**
	 * 取得西元年明天日期(YYYYMMDD)
	 * 
	 * @param baseDate
	 *            基準日期
	 * @return yyyyMMdd
	 * @throws ParseException
	 */
	public static String getADTomorrow(String baseDate) throws ParseException {
		DateFormat dateFormat = new SimpleDateFormat("yyyyMMdd");
		Calendar calendar = Calendar.getInstance();
		calendar.setTime(dateFormat.parse(baseDate));
		calendar.set(Calendar.DATE, calendar.get(Calendar.DATE) + 1);
		return dateFormat.format(calendar.getTime());
	}

	/**
	 * 取得民國年明天日期(YYYMMDD)
	 * 
	 * @param baseDate
	 *            基準日期
	 * @return yyyMMdd
	 * @throws ParseException
	 */
	public static String getTomorrow(String baseDate) throws ParseException {
		String baseDay_AD = Transform.ROCDateStringToADDateString(baseDate);// 先轉成西元
		DateFormat dateFormat = new SimpleDateFormat("yyyyMMdd");
		Calendar calendar = Calendar.getInstance();
		calendar.setTime(dateFormat.parse(baseDay_AD));
		calendar.set(Calendar.DATE, calendar.get(Calendar.DATE) + 1);
		String date_AD = dateFormat.format(calendar.getTime());
		return Transform.ADDateStringToROCDateString(date_AD);// 再轉回民國
	}

	/**
	 * 取得民國年昨天日期(YYYMMDD)
	 * 
	 * @param baseDate
	 *            基準日期
	 * @return yyyMMdd
	 * @throws ParseException
	 */
	public static String getYesterday(String baseDate) throws ParseException {
		String baseDay_AD = Transform.ROCDateStringToADDateString(baseDate);// 先轉成西元
		DateFormat dateFormat = new SimpleDateFormat("yyyyMMdd");
		Calendar calendar = Calendar.getInstance();
		calendar.setTime(dateFormat.parse(baseDay_AD));
		calendar.set(Calendar.DATE, calendar.get(Calendar.DATE) - 1);
		String date_AD = dateFormat.format(calendar.getTime());
		return Transform.ADDateStringToROCDateString(date_AD);// 再轉回民國
	}

	/**
	 * 取得當月第一天日期
	 * 
	 * @param date
	 * @return
	 */
	public static Date getMonthFirstDay(Date date) {
		if (date == null) {
			return null;
		}
		return truncate(DATE_CATEGORIES.MONTH, date);
	}

	public static String getMonthFirstDay(String date) {
		String retDate = null;
		try {
			retDate = Transform.DateToROCDateString(getMonthFirstDay(Transform.ROCDateStringToDate(date)));
		} catch (ParseException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return retDate;
	}

	/**
	 * 取得當月最後一天日期
	 * 
	 * @param baseDate
	 *            基準日期
	 * @return yyyMMdd
	 * @throws ParseException
	 */
	public static Date getMonthLastDay(Date baseDate) {
		if (baseDate == null) {
			return null;
		}
		baseDate = getAddDate(DATE_CATEGORIES.MONTH, baseDate, 1);
		baseDate = truncate(DATE_CATEGORIES.MONTH, baseDate);
		baseDate = getAddDate(DATE_CATEGORIES.DAY, baseDate, -1);
		return baseDate;
	}

	public static String getMonthLastDay(String baseDate) {
		String retDate = null;
		try {
			retDate = Transform.DateToROCDateString(getMonthLastDay(Transform.ROCDateStringToDate(baseDate)));
		} catch (ParseException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return retDate;
	}

	/**
	 * 取得星期字串 1/2/3/4/5/6/0 （星期一～星期日）
	 * 
	 * @param date
	 * @return
	 */
	public static int getWeek(Date date) {
		Calendar calendar = Calendar.getInstance();
		calendar.setTime(date);
		return calendar.get(Calendar.DAY_OF_WEEK) - 1;// week 與星期差一天（星期一：Week=2)
	}

	public static int getWeek(String baseDate) throws ParseException {
		return getWeek(Transform.ROCDateStringToDate(baseDate));
	}

	/**
	 * 取得當星期第一天日期(星期日)
	 * 
	 * @param date
	 * @return
	 */
	public static Date getWeekFirstDay(Date date) {
		if (date == null) {
			return null;
		}
		Calendar calendar = Calendar.getInstance();
		calendar.setTime(date);
		int d = calendar.get(Calendar.DAY_OF_WEEK);
		if (d > 1) {
			calendar.add(calendar.DATE, 1 - d);
			date = calendar.getTime();
			return date;
		} else {
			return date;
		}
	}

	public static String getWeekFirstDay(String date) {
		String retDate = null;
		try {
			retDate = Transform.DateToROCDateString(getWeekFirstDay(Transform.ROCDateStringToDate(date)));
		} catch (ParseException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return retDate;
	}

	/**
	 * 取得當星期最後一天日期(星期六)
	 * 
	 * @param date
	 * @return
	 */
	public static Date getWeekLastDay(Date date) {
		if (date == null) {
			return null;
		}
		Calendar calendar = Calendar.getInstance();
		calendar.setTime(date);
		int d = calendar.get(Calendar.DAY_OF_WEEK);
		if (d < 7) {
			calendar.add(calendar.DATE, 7 - d);
			date = calendar.getTime();
			return date;
		} else {
			return date;
		}
	}

	public static String getWeekLastDay(String date) {
		String retDate = null;
		try {
			retDate = Transform.DateToROCDateString(getWeekLastDay(Transform.ROCDateStringToDate(date)));
		} catch (ParseException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return retDate;
	}

}
