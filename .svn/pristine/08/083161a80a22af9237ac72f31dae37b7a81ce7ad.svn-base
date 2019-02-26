package model;

import library.utility.EntityFactory;
import library.utility.JDBCUtilities;
import library.utility.MapUtil;

import java.sql.Connection;
import java.sql.SQLException;
import java.util.List;
import java.util.Map;


/**
 * Created by jeffy on 2018/4/19.
 */
public class Critical {
    private Connection con;

    public Critical(Connection con) {
        this.con = con;
    }

    public List<Map<String, Object>> queryCriticalByChartNo(int chartNo) throws SQLException {
        String queryString =
                "SELECT a.chart_no, a.ill_icd9, a.start_date, a.end_date, a.ill_card_no,  " +
                "       a.photocopy, a.icd_type " +
                "  FROM critical a " +
                " WHERE a.chart_no = ?  " +
                " ORDER BY a.start_date desc ";


        EntityFactory criticalEntity = new EntityFactory(con, queryString);
        return criticalEntity.findMultiple(new Object[]{chartNo});
    }


    public static void main(String[] args) {
        Connection myConnection = null;
        JDBCUtilities jdbcUtil = new JDBCUtilities();
        String resultStrng;

        try {
            myConnection = jdbcUtil.getConnection();
            Critical critical = new Critical(myConnection);

            int chartNo = 281678;
            System.out.printf("\nCritical.queryCriticalByChartNo chartNo=%d JsonArray:%s ", chartNo,
                    MapUtil.listMapToJsonArray(critical.queryCriticalByChartNo(chartNo)));


        } catch (SQLException ex) {
            JDBCUtilities.printSQLException(ex);
        } finally {
            if (myConnection != null) {
                JDBCUtilities.closeConnection(myConnection);
            }
        }
    }    
}
