package library.dateutility;

import java.text.ParseException;
import java.text.SimpleDateFormat;

public class Validate {


	/**
	 * 判斷日期格式是否正確
	 * 
	 * @param String dateStr
	 * 
	 * @return Boolean
	 * 
	 * @exception n/a
	 */
	public static Boolean isValidDate(String dateStr) {
		String str = dateStr;
		Boolean convertSuccess = true;
		SimpleDateFormat format = new SimpleDateFormat("yyyyMMddHHmm");

		String dateType = "";
		if (dateStr.length() == 3) {
			str = str + "01010101";
			dateType = "1";
		} // 民國年補滿格式："yyyMMddHHmm")
		if (dateStr.length() == 4) {
			str = str + "01010101";
			dateType = "2";
		} // 西元年補滿格式："yyyyMMddHHmm")
		if (dateStr.length() == 5) {
			str = str + "010101";
			dateType = "1";
		} // 民國年月補滿格式："yyyMMddHHmm")
		if (dateStr.length() == 6) {
			str = str + "010101";
			dateType = "2";
		} // 西元年月補滿格式："yyyyMMddHHmm")
		if (dateStr.length() == 7) {
			str = str + "0101";
			dateType = "1";
		} // 民國年月日時分補滿格式："yyyMMddHHmm")
		if (dateStr.length() == 8) {
			str = str + "0101";
			dateType = "2";
		} // 西元年月日時分補滿格式："yyyyMMddHHmm")
		if (dateStr.length() == 11) {
			dateType = "1";
		} // 民國年月日時分)
		if (dateStr.length() == 12) {
			dateType = "2";
		} // 西元年月日時分)
		System.out.println("input dateStr:" + dateStr+"  and dateType="+dateType+"  and 補滿格式="+str);
		
		try {
			String subyyyyMMdd = null;
			if (dateType == "1") {// 民國年月日時分轉為西元年月日時分
				subyyyyMMdd = String.valueOf((Integer.valueOf(str.substring(0, 3)) + 1911)) + str.substring(3);
			} else {
				subyyyyMMdd = str;
			}
			// set lenient=false.
			// 否則SimpleDateFormat會比較寬鬆驗證日期,比如2007/02/29會被接受，並且換成2007/03/01
			format.setLenient(false);
			format.parse(subyyyyMMdd);
		} catch (ParseException e) {
			// e.printStackTrace();
			// 如果throw java.text.ParseException或者NullPointerException，就说明格式不对
			convertSuccess = false;
		}
		return convertSuccess;
	}

}
