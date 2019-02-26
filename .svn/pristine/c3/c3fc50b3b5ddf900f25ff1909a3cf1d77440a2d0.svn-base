/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package library.db;

import java.io.IOException;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.Properties;
import javax.naming.Context;
import javax.naming.InitialContext;
import javax.naming.NamingException;
import javax.sql.DataSource;
import library.encode.EncodeUtilImpl;
import library.encode.PropertiesUtil;
import library.managedbean.SystemBean;

/**
 *
 * @author Lijen
 */
public class ConnDB {

    private Connection nowConn = null;
    private String connMsg;

    public Connection getNowConn() {
        return nowConn;
    }

    public String getConnMsg() {
        return connMsg;
    }

    public void setConnMsg(String connMsg) {
        this.connMsg = connMsg;
    }

    public void setNowConn(Connection nowConn) {
        this.nowConn = nowConn;
    }

    public Connection getConnection() throws IOException, SQLException {
        String dbConnectionType =SystemBean.getDbConnectionType();        
        if (dbConnectionType.equals("JDBC")){
            return getConnectionByJDBC();
        }else
        {
            return getConnectionByJNDI();
        }
    } 
    
    
    public Connection getConnectionByJDBC() throws IOException {
		PropertiesUtil pu = new PropertiesUtil();
		EncodeUtilImpl eu=new EncodeUtilImpl();
		Properties properties =pu.loadProperties();
		String driver = properties.getProperty("driver");
		String url = properties.getProperty("url");
		String user = null;
		String password = null;
        try {
            user = eu.decodeOne(properties.getProperty("user"));
            password = eu.decodeOne(properties.getProperty("password"));
            //System.out.println("user:"+user+"  password:"+password);
        } catch (Exception e1) {
            e1.printStackTrace();
            System.out.println("decodeOne exception:"+e1.getMessage());
        }
        try {
            Class.forName(driver); 
            nowConn = DriverManager.getConnection(url, user, password);
            connMsg = null;
            return nowConn;
        } catch ( SQLException e) {
            connMsg = e.getMessage();
            System.out.println(connMsg);
            return null;
        } catch (ClassNotFoundException e) {
            // TODO Auto-generated catch block
            connMsg = e.getMessage();
            System.out.println(connMsg);
            return null;
        }
    }


    
    public Connection getConnectionByJNDI() throws IOException, SQLException {
        Connection conn = null;
        try {
            Context initContext = new InitialContext();
            Context envContext  = (Context)initContext.lookup("java:/comp/env");
            DataSource ds = (DataSource)envContext.lookup("jdbc/fangdb");
            conn = ds.getConnection();
        } catch (NamingException e) {
            // TODO Auto-generated catch block
            System.out.println(e.getMessage());
            e.printStackTrace();
        }

        return conn;
    }    
    
    
    public void closeConn() throws SQLException {
        nowConn.close();
    }

}
