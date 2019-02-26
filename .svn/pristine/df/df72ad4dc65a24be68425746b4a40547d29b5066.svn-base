package model;

import library.utility.EntityFactory;
import library.utility.JDBCUtilities;
import library.utility.MapUtil;

import java.sql.Connection;
import java.sql.SQLException;
import java.util.List;
import java.util.Map;

/**
 * Created by jeffy on 2018/4/20.
 */
public class Allergy {
    private Connection con;

    public Allergy(Connection con) {
        this.con = con;
    }

    public List<Map<String, Object>> queryAllergyByChartNo(int chartNo) throws SQLException {
        String queryString =
                "SELECT a.chart_no, a.allergy, b.const_kind, " +
                "       CASE " +
                "           WHEN b.const_kind = '1' THEN '醫令' " +
                "           WHEN b.const_kind = '2' THEN '成分' " +
                "           ELSE ''  " +
                "       END AS kind_name, " +
                "       b.code, " +
                "       CASE " +
                "           WHEN b.const_kind = '1' THEN (SELECT c.full_name from PRICE c where c.code = b.code) " +
                "           WHEN b.const_kind = '2' THEN (SELECT d.full_name from COMPONENT d where d.code = b.code) " +
                "           ELSE ''  " +
                "       END AS full_name " +
                "  FROM allergy a, allergycomp b " +
                " WHERE a.chart_no = ? " +
                "   AND a.chart_no = b.chart_no(+) " +
                " ORDER BY a.chart_no, b.const_kind ";

        EntityFactory allergyEntity = new EntityFactory(con, queryString);
        return allergyEntity.findMultiple(new Object[]{chartNo});
    }


    public static void main(String[] args) {
        Connection myConnection = null;
        JDBCUtilities jdbcUtil = new JDBCUtilities();
        String resultStrng;

        try {
            myConnection = jdbcUtil.getConnection();
            Allergy allergy = new Allergy(myConnection);

            //int chartNo = 940219;
            int chartNo = 901307;
            System.out.printf("\nAllergy.queryAllergyByChartNo chartNo=%d JsonArray:%s ", chartNo,
                    MapUtil.listMapToJsonArray(allergy.queryAllergyByChartNo(chartNo)));

        } catch (SQLException ex) {
            JDBCUtilities.printSQLException(ex);
        } finally {
            if (myConnection != null) {
                JDBCUtilities.closeConnection(myConnection);
            }
        }
    }    
}
