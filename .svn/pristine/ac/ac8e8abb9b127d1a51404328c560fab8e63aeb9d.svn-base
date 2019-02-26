package library.dateutility;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.Statement;
import java.sql.Timestamp;
import java.text.ParseException;

public class SystemTimeStamp {

    /**
     * 取出資料庫系統民國年日期字串
     * 
     * @param con Database connection
     * 
     * @return String ROCyyyMMdd:民國年日期 （1060101）
     *
     */
    public static String GetSystemDateString(Connection con) throws ParseException {
        String dateString = null;
        try {
            Statement st = con.createStatement();
            ResultSet rs = st.executeQuery("SELECT TO_CHAR(SYSDATE, 'YYYYMMDD') systemDate FROM DUAL");
            while (rs.next()) {
                dateString = Transform.ADDateStringToROCDateString(rs.getString("systemDate"));
            }
            rs.close();
            st.close();
        } catch (Exception ex) {
            System.out.println(ex.getMessage());
        }
        return dateString;
    }

    /**
     * 取出資料庫系統西元年日期字串
     * 
     * @param con　Database connection
     * 
     * @return String ROCyyyMMdd:西元年日期 （20160101）
     *
     */
    public static String GetADDateString(Connection con) throws ParseException {
        String dateString = null;
        try {
            Statement st = con.createStatement();
            ResultSet rs = st.executeQuery("SELECT TO_CHAR(SYSDATE, 'YYYYMMDD') systemDate FROM DUAL");
            while (rs.next()) {
                dateString = rs.getString("systemDate");
            }
            rs.close();
            st.close();
        } catch (Exception ex) {
            System.out.println(ex.getMessage());
        }
        return dateString;
    }

    /**
     * 取出資料庫系統民國年時間字串 （如：14：20）
     * 
     * @param con　Database connection
     * 
     * @return String systemTime:民國時間字串 （如：14：20）
     *
     */
    public static String GetTimeString(Connection con) throws ParseException {
        String systemTime = null;
        try {
            Statement st = con.createStatement();
            ResultSet rs = st.executeQuery("SELECT TO_CHAR(SYSDATE, 'HH24mm') systemTime FROM DUAL");
            while (rs.next()) {
                systemTime = (rs.getString("systemTime"));
            }
            rs.close();
            st.close();
        } catch (Exception ex) {
            System.out.println(ex.getMessage());
        }
        return systemTime;
    }

    /**
     * 取出資料庫系統時間
     * 
     * @param con
     *            formConnDB
     * 
     * @return Timestamp
     *
     */
    public static Timestamp GetSystemDateTime(Connection con) throws ParseException {
        Timestamp dateString = null;
        try {
            Statement st = con.createStatement();
            ResultSet rs = st.executeQuery("SELECT sysdate FROM DUAL");
            while (rs.next()) {
                dateString = rs.getTimestamp("sysdate");
            }
            rs.close();
            st.close();
        } catch (Exception ex) {
            System.out.println(ex.getMessage());
        }
        return dateString;
    }

}
