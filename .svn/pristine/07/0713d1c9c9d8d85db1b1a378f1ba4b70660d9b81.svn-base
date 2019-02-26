package model;

import library.utility.EntityFactory;
import library.utility.JDBCUtilities;
import library.utility.MapUtil;

import java.sql.Connection;
import java.sql.SQLException;
import java.util.List;
import java.util.Map;

/**
 * Created by jeffy on 2018/2/21.
 */
public class OrAntibiotic {
    private Connection con;

    public OrAntibiotic(Connection con) {
        this.con = con;
    }

    public List<Map<String, Object>> queryOrAntibioticByPrimaryKeys(String opDate, int chartNo, int serno, int times) throws SQLException {
        String queryString =
                "SELECT a.op_date, a.chart_no, a.serno, a.times, a.order_datetime, a.code, " +
                "       b.full_name code_name, a.qty " +
                "  FROM or_antibiotic a, price b " +
                " WHERE a.op_date = ? " +
                "   AND a.chart_no = ? " +
                "   AND a.serno = ? " +
                "   AND a.times = ? " +
                "   AND a.code = b.code(+) " +
                " ORDER BY order_datetime, code ";

        EntityFactory orAntibioticEntity = new EntityFactory(con, queryString);
        return orAntibioticEntity.findMultiple(new Object[]{opDate, chartNo, serno, times});
    }

    public static void main(String[] args) {
        Connection myConnection = null;
        JDBCUtilities jdbcUtil = new JDBCUtilities();
        String resultStrng;

        try {
            myConnection = jdbcUtil.getConnection();
            OrAntibiotic orAntibiotic = new OrAntibiotic(myConnection);

            String opDate = "1020521";
            int chartNo = 990554;
            int serno = 86971;
            int times = 1;
            System.out.printf("\nOrAntibiotic.queryOrAntibioticByPrimaryKeys opDate=%s chartNo=%d serno=%d times=%d JsonArray:%s ",
                    opDate, chartNo, serno, times, MapUtil.listMapToJsonArray(orAntibiotic.queryOrAntibioticByPrimaryKeys(opDate, chartNo, serno, times)).toString());

        } catch (SQLException ex) {
            JDBCUtilities.printSQLException(ex);
        } finally {
            if (myConnection != null) {
                JDBCUtilities.closeConnection(myConnection);
            }
        }
    }
}


