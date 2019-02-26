package model;

import library.utility.EntityFactory;
import library.utility.JDBCUtilities;
import library.utility.MapUtil;

import java.sql.Connection;
import java.sql.SQLException;
import java.util.Map;

/**
 * Created by jeffy on 2017/10/12.
 */
public class Division {
    private Connection con;

    public Division(Connection con) {
        this.con = con;
    }

    public Map<String, Object> queryDivisionByDivNo(String divNo) throws SQLException {
        String queryString =
                "SELECT a.div_no, a.div_name " +
                "  FROM division a " +
                " WHERE div_no = ? ";

        EntityFactory divisionEntity = new EntityFactory(con, queryString);
        return divisionEntity.findSingle(new Object[]{divNo});
    }

    public static void main(String[] args) {
        Connection myConnection = null;
        JDBCUtilities jdbcUtil = new JDBCUtilities();
        String resultStrng;

        try {
            myConnection = jdbcUtil.getConnection();
            Division division = new Division(myConnection);

            System.out.println("\nDivision.queryDivisionByDivNo divNo='MM' Map: " +
                    division.queryDivisionByDivNo("MM"));

            System.out.println("\nDivision.queryDivisionByDivNo divNo='MM' JsonObject: " +
                    MapUtil.mapToJsonObject(division.queryDivisionByDivNo("MM")));

        } catch (SQLException ex) {
            JDBCUtilities.printSQLException(ex);
        } finally {
            if (myConnection != null) {
                JDBCUtilities.closeConnection(myConnection);
            }
        }
    }
}
