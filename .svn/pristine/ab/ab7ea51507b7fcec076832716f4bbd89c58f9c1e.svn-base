package model;

import library.utility.EntityFactory;
import library.utility.JDBCUtilities;
import library.utility.MapUtil;

import java.sql.Connection;
import java.sql.SQLException;
import java.util.Map;


/**
 * Created by jeffy on 2018/4/18.
 */
public class PacsSetting {
    private Connection con;

    public PacsSetting(Connection con) {
        this.con = con;
    }

    public Map<String, Object> queryPacsSetting() throws SQLException {
        String queryString =
                "SELECT a.pacs_company, a.pacs_server_ip, a.pacs_user, a.pacs_passwd, " +
                "       a.client_call_string, a.web_call_string, a.study_uid_string " +
                "  FROM pacs_setting a " +
                " WHERE pacs_company = 'EC' ";

        EntityFactory pacsSettingEntity = new EntityFactory(con, queryString);
        return pacsSettingEntity.findSingle(new Object[]{});
    }


    public static void main(String[] args) {
        Connection myConnection = null;
        JDBCUtilities jdbcUtil = new JDBCUtilities();
        String resultStrng;

        try {
            myConnection = jdbcUtil.getConnection();
            PacsSetting pacsSetting = new PacsSetting(myConnection);

            System.out.println("\nPacsSetting.queryPacsSetting JsonObject: " +
                    MapUtil.mapToJsonObject(pacsSetting.queryPacsSetting()));


        } catch (SQLException ex) {
            JDBCUtilities.printSQLException(ex);
        } finally {
            if (myConnection != null) {
                JDBCUtilities.closeConnection(myConnection);
            }
        }
    }    
}
