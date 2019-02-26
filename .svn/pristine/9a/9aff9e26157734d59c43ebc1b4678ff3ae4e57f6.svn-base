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
public class Disicd {
    private Connection con;

    public Disicd(Connection con) {
        this.con = con;
    }

    public Map<String, Object> queryDisicdByCode(String code) throws SQLException {
        String queryString =
                "SELECT code, title1, title2, he_code, is_detail " +
                "  FROM disicd10 " +
                " WHERE code = ? " +
                " UNION ALL " +
                "SELECT code, title1, title2, he_code, not_main " +
                "  FROM disicd " +
                " WHERE code = ? ";

        EntityFactory disicdEntity = new EntityFactory(con, queryString);
        return disicdEntity.findSingle(new Object[]{code, code});
    }

    public static void main(String[] args) {
        JDBCUtilities jdbcUtil = new JDBCUtilities();
        Connection myConnection = null;
        String resultStrng = null;

        try {
            myConnection = jdbcUtil.getConnection();
            Disicd disicd = new Disicd(myConnection);

            System.out.println("\nDisicd.queryDisicdByCode code='001.0' JsonObject: " +
                    MapUtil.mapToJsonObject(disicd.queryDisicdByCode("001.0")));

            System.out.println("\nDisicd.queryDisicdByCode code='001.0' JsonObject: " +
                    MapUtil.mapToJsonObject(disicd.queryDisicdByCode("A52.76")));

        } catch (SQLException ex) {
            JDBCUtilities.printSQLException(ex);
        } finally {
            if (myConnection != null) {
                JDBCUtilities.closeConnection(myConnection);
            }
        }
    }
}
