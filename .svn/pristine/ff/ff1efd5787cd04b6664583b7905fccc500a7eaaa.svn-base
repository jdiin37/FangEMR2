package model;

import library.utility.EntityFactory;
import library.utility.JDBCUtilities;
import library.utility.MapUtil;

import java.sql.Connection;
import java.sql.SQLException;
import java.util.Map;

/**
 * Created by jeffy on 2017/10/24.
 */
public class Disiop {
    private Connection con;

    public Disiop(Connection con) {
        this.con = con;
    }

    public Map<String, Object> queryDisiopByCode(String code) throws SQLException {
        String queryString =
                "SELECT code, title1, title2, he_code, not_main " +
                "  FROM disiop10 " +
                " WHERE code = ? " +
                " UNION ALL " +
                "SELECT code, title1, title2, he_code, not_main " +
                "  FROM disiop " +
                " WHERE code = ? ";

        EntityFactory disiopEntity = new EntityFactory(con, queryString);
        return disiopEntity.findSingle(new Object[]{code, code});
    }

    public static void main(String[] args) {
        JDBCUtilities jdbcUtil = new JDBCUtilities();
        Connection myConnection = null;
        String resultStrng = null;

        try {
            myConnection = jdbcUtil.getConnection();
            Disiop disiop = new Disiop(myConnection);

            System.out.println("\nDisiop.queryDisiopByCode code='02.06' JsonObject: " +
                    MapUtil.mapToJsonObject(disiop.queryDisiopByCode("02.06")));

            System.out.println("\nDisiop.queryDisiopByCode code='0016073' JsonObject: " +
                    MapUtil.mapToJsonObject(disiop.queryDisiopByCode("0016073")));

        } catch (SQLException ex) {
            JDBCUtilities.printSQLException(ex);
        } finally {
            if (myConnection != null) {
                JDBCUtilities.closeConnection(myConnection);
            }
        }
    }
}
