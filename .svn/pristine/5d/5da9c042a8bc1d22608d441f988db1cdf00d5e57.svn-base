package library.managedbean;

import java.util.ResourceBundle;

/**
 * Created by jeffy on 2017/3/13.
 */
public class SystemBean {

    private static long sessionTimeOut;//連線 timeout
    private static String hospNo;//現行醫院代碼
    private static String hospName;//現行醫院名稱
    private static String hospDate;//現在門診日期
    private static ResourceBundle bundle;//現在語系  bundle
    private static String dbConnectionType;// database connection type : JDBC/JNDI


    public static String getDbConnectionType() {
        return dbConnectionType;
    }

    public static void setDbConnectionType(String dbConnectionType) {
        SystemBean.dbConnectionType = dbConnectionType;
    }

    public static ResourceBundle getBundle() {
        return bundle;
    }

    public static void setBundle(ResourceBundle bundle) {
        SystemBean.bundle = bundle;
    }

    public static String getHospNo() {
        return hospNo;
    }

    public static void setHospNo(String hospNo) {
        SystemBean.hospNo = hospNo;
    }

    public static String getHospName() {
        return hospName;
    }

    public static void setHospName(String hospName) {
        SystemBean.hospName = hospName;
    }

    public static String getHospDate() {
        return hospDate;
    }

    public static void setHospDate(String hospDate) {
        SystemBean.hospDate = hospDate;
    }

    public static long getSessionTimeOut() {
        return sessionTimeOut;
    }

    public static void setSessionTimeOut(long sessionTimeOut) {
        SystemBean.sessionTimeOut = sessionTimeOut;
    }

    public static void iniAllParameter(){
        setHospNo(null);
        setHospName(null);
        setHospDate(null);
        setSessionTimeOut(30);
        //setDbConnectionType(null); jeffy
        setDbConnectionType("JDBC");
    }
}
