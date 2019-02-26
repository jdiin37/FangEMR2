package model;

import library.utility.EntityFactory;
import library.utility.JDBCUtilities;
import library.utility.MapUtil;

import java.sql.Connection;
import java.sql.SQLException;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static library.utility.MapUtil.castToInt;

/**
 * Created by jeffy on 2018/4/2.
 */
public class Chart1 {
    private Connection con;

    public Chart1(Connection con) {
        this.con = con;
    }

    public List<Map<String, Object>> queryChart1ListByChartNoDateRange(int chartNo, String startDate, String endDate) throws SQLException {
        String queryString =
                "SELECT a.view_date, a.chart_no, a.duplicate_no, a.complaint, a.diagnosis, a.diagnosis1, " +
                "       a.temperature, a.systolic_pressure, a.diastolic_pressure, a.height, a.weight, " +
                "       a.pulse, a.blood_sugar, a.plan, b.charth chart_history  " +
                "  FROM chart1 a, charth b " +
                " WHERE a.view_date BETWEEN ? AND ? " +
                "   AND a.chart_no = ? " +
                "   AND a.chart_no = b.chart_no(+) " +
                " ORDER BY view_date, a.chart_no, a.duplicate_no ";

        EntityFactory chart1Entity = new EntityFactory(con, queryString);
        return chart1Entity.findMultiple(new Object[]{startDate, endDate, chartNo});
    }

    public Map<String, Object> queryChart1ByPrimaryKeys(String viewDate, int chartNo, int duplicateNo) throws SQLException {
        Map<String, Object> resultMap = new LinkedHashMap<>();
        List<Map<String, Object>> chart1MapList = queryChart1ListByChartNoDateRange(chartNo, viewDate, viewDate);

        if (!chart1MapList.isEmpty()) {
            Optional<Map<String, Object>> optionalMap = chart1MapList.stream()
                    .filter(map -> castToInt(map.get("duplicate_no")) == duplicateNo)
                    .findFirst();

            resultMap = optionalMap.orElse(null);
        }

        return  resultMap;
    }


    public static void main(String[] args) {
        Connection myConnection = null;
        JDBCUtilities jdbcUtil = new JDBCUtilities();
        String resultStrng;

        try {
            myConnection = jdbcUtil.getConnection();
            Chart1 chart1 = new Chart1(myConnection);

            int chartNo = 912473;
            String startDate = "1051209";
            String endDate = "1051213";
            System.out.printf("\nChart1.queryChart1ListByChartNoDateRange startDate='%s' endDate='%s' chartNo=%d JsonArray:%s ",
                    startDate, endDate, chartNo, MapUtil.listMapToJsonArray(chart1.queryChart1ListByChartNoDateRange(chartNo, startDate, endDate)).toString());

            chartNo = 912473;
            String viewDate = "1051209";
            int duplicateNo = 1;
            System.out.printf("\nChart1.queryChart1ByPrimaryKeys viewDate='%s' chartNo=%d duplicateNo=%d JsonObject:%s ",
                    viewDate, chartNo, duplicateNo, MapUtil.mapToJsonObject(chart1.queryChart1ByPrimaryKeys(viewDate, chartNo, duplicateNo)).toString());

        } catch (SQLException ex) {
            JDBCUtilities.printSQLException(ex);
        } finally {
            if (myConnection != null) {
                JDBCUtilities.closeConnection(myConnection);
            }
        }
    }
}

