package servlets;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.DatabaseMetaData;
import java.sql.Date;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Properties;

import javax.naming.Context;
import javax.naming.InitialContext;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.sql.DataSource;

import library.encode.PropertiesUtil;

@WebServlet(urlPatterns = "/testJNDI", loadOnStartup = 1)
public class TestJDNI extends HttpServlet {
    private static final long serialVersionUID = 1L;
    
    private String context;
    private String dataSource;
    private Properties prop;
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        // You may use the following lines to initialize the context.
        // Obtain our environment naming context
        // try with http:url/testJNDI
        Context initCtx;
        try {
            initCtx = new InitialContext();
            
            this.prop = new Properties();
            this.prop = PropertiesUtil.loadProperties();
            this.context = this.prop.getProperty("context");
            this.dataSource = this.prop.getProperty("dataSource");
            System.out.print("context:["+context+"] and datasource:["+dataSource+"]");
            Context envCtx = (Context) initCtx.lookup(this.context);

            // A data source can be obtained by doing the following.
            // Look up our data source
            DataSource ds = (DataSource) envCtx.lookup(this.dataSource);

            // Allocate and use a connection from the pool

            // ... use this connection to access the database ...
            resp.setContentType("text/html");
            resp.setCharacterEncoding("UTF-8");
            try (PrintWriter writer = resp.getWriter(); Connection conn = ds.getConnection();) {
                writer.print("[context][dataSource]: [" + this.context+"]["+this.dataSource+ "]<br />");
                writer.print("connected(true/false): " + !conn.isClosed()+ "<br />");
                DatabaseMetaData metadata = conn.getMetaData();
                writer.print("Database Product Name: " + metadata.getDatabaseProductName()+ "<br />");
                writer.print("Database Product Version: " + metadata.getDatabaseProductVersion()+ "<br />");
                writer.print("Logged User: " + metadata.getUserName()+ "<br />");
                writer.print("JDBC Driver: " + metadata.getDriverName()+ "<br />");
                writer.print("Driver Version: " + metadata.getDriverVersion()+ "<br />");
                writer.print("URL: " + metadata.getURL()+ "<br />");

                
                
                if (metadata.getDatabaseProductName().equals("Oracle") && conn != null) {//only in oracle database
                    String sql = "SELECT INSTANCE, UTL_INADDR.get_host_address HOST FROM V$THREAD";
                    PreparedStatement statement = conn.prepareStatement(sql);
                    ResultSet rs = statement.executeQuery();
                    while (rs.next()) {
                        String instance = rs.getString("INSTANCE");
                        //String host = rs.getString("HOST");
                        writer.print("The current sid is " + instance+ "<br />");
                        //writer.print("The HOST is " + host+ "<br />");
                     }

                    conn.close();
                }
                
                
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
