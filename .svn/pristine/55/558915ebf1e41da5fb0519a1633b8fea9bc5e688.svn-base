package model;

import library.utility.EntityFactory;
import library.utility.JDBCUtilities;
import library.utility.MapUtil;

import java.sql.Connection;
import java.sql.SQLException;
import java.util.*;

import static library.utility.MapUtil.castToInt;

/**
 * Created by jeffy on 2018/4/10.
 */
public class PatinpEX {
    private Connection con;

    public PatinpEX(Connection con) {
        this.con = con;
    }


    private List<Map<String, Object>> queryInpDis10ListByChartNoSerno(int chartNo, int serno) throws SQLException {
        String queryString =
                "SELECT a.chart_no, a.serno, a.rec_count, a.disease_code, " +
                "       b.title1 code_name_c, b.title2 code_name_e, b.range_no1, b.range_no2, " +
                "       c.name_c range_name_c, c.name_e range_name_e " +
                "  FROM chgicdcm a, disicd10 b, vicd10cmrange2 c, patinp d " +
                " WHERE a.chart_no = ? " +
                "   AND a.serno = ?" +
                "   AND (a.chart_no = d.chart_no AND a.serno = d.serno AND d.discharge_date >= '1050101') " +
                "   AND a.report_class = 'I' " + // (I:前台住院 D.疾病分類 住院申報(1.....由 report Table 中設定)
                "   AND a.disease_type = 'D' " + // (E:外因碼 D:疾病碼 A:最初診斷 F:最後診斷)
                "   AND a.icd_type = 'ICD10' " +
                "   AND a.disease_code = b.code(+) " +
                "   AND b.range_no2 = c.range_no2(+) " +
                "ORDER BY chart_no, serno, rec_count ";

        EntityFactory patinpExEntity = new EntityFactory(con, queryString);
        return patinpExEntity.findMultiple(new Object[]{chartNo, serno});
    }

    private List<Map<String, Object>> queryInpDis9ListByChartNoSerno(int chartNo, int serno) throws SQLException {
        Object[] inputParas = {
                chartNo, serno,
                chartNo, serno,
                chartNo, serno,
                chartNo, serno,
                chartNo, serno};

        String queryString =
                // 主診斷
                "SELECT a.chart_no, a.serno, 1 rec_count, a.disease_icd9 disease_code, " +
                "       b.title2 code_name_c, b.title1 code_name_e, '' range_no1, " +
                "       c.start_code||'-'|| c.end_code range_no2, c.c_name range_name_c, c.e_name range_name_e " +
                "  FROM patinp a, disicd b, icdop_item2 c " +
                " WHERE a.chart_no = ? " +
                "   AND a.serno = ? " +
                "   AND a.discharge_date < '1050101' " +
                "   AND a.status <> 0 " +
                "   AND a.disease_icd9 = b.code(+) " +
                "   AND substr(a.disease_icd9, 1, 3) BETWEEN c.start_code AND c.end_code " +
                "   AND c.dis_type = '1' " +
                "UNION ALL " +
                // 次診斷 1
                "SELECT a.chart_no, a.serno, 2 rec_count, a.disease_icd9_1 disease_code, " +
                "       b.title2 code_name_c, b.title1 code_name_e, '' range_no1, " +
                "       c.start_code||'-'|| c.end_code range_no2, c.c_name range_name_c, c.e_name range_name_e " +
                "  FROM patinp a, disicd b, icdop_item2 c " +
                " WHERE a.chart_no = ? " +
                "   AND a.serno = ? " +
                "   AND a.discharge_date < '1050101' " +
                "   AND a.status <> 0 " +
                "   AND a.disease_icd9_1 = b.code(+) " +
                "   AND substr(a.disease_icd9_1, 1, 3) BETWEEN c.start_code AND c.end_code " +
                "   AND c.dis_type = '1' " +
                "UNION ALL " +
                // 次診斷 2
                "SELECT a.chart_no, a.serno, 3 rec_count, a.disease_icd9_2 disease_code, " +
                "       b.title2 code_name_c, b.title1 code_name_e, '' range_no1, " +
                "       c.start_code||'-'|| c.end_code range_no2, c.c_name range_name_c, c.e_name range_name_e " +
                "  FROM patinp a, disicd b, icdop_item2 c " +
                " WHERE a.chart_no = ? " +
                "   AND a.serno = ? " +
                "   AND a.discharge_date < '1050101' " +
                "   AND a.status <> 0 " +
                "   AND a.disease_icd9_2 = b.code(+) " +
                "   AND substr(a.disease_icd9_2, 1, 3) BETWEEN c.start_code AND c.end_code " +
                "   AND c.dis_type = '1' " +
                "UNION ALL " +
                // 次診斷 3
                "SELECT a.chart_no, a.serno, 4 rec_count, a.disease_icd9_3 disease_code, " +
                "       b.title2 code_name_c, b.title1 code_name_e, '' range_no1, " +
                "       c.start_code||'-'|| c.end_code range_no2, c.c_name range_name_c, c.e_name range_name_e " +
                "  FROM patinp a, disicd b, icdop_item2 c " +
                " WHERE a.chart_no = ? " +
                "   AND a.serno = ? " +
                "   AND a.discharge_date < '1050101' " +
                "   AND a.status <> 0 " +
                "   AND a.disease_icd9_3 = b.code(+) " +
                "   AND substr(a.disease_icd9_3, 1, 3) BETWEEN c.start_code AND c.end_code " +
                "   AND c.dis_type = '1' " +
                "UNION ALL " +
                // 次診斷 4
                "SELECT a.chart_no, a.serno, 5 rec_count, a.disease_icd9_4 disease_code, " +
                "       b.title2 code_name_c, b.title1 code_name_e, '' range_no1, " +
                "       c.start_code||'-'|| c.end_code range_no2, c.c_name range_name_c, c.e_name range_name_e " +
                "  FROM patinp a, disicd b, icdop_item2 c " +
                " WHERE a.chart_no = ? " +
                "   AND a.serno = ? " +
                "   AND a.discharge_date < '1050101' " +
                "   AND a.status <> 0 " +
                "   AND a.disease_icd9_4 = b.code(+) " +
                "   AND substr(a.disease_icd9_4, 1, 3) BETWEEN c.start_code AND c.end_code " +
                "   AND c.dis_type = '1' " +
                "ORDER BY chart_no, serno, rec_count ";


        EntityFactory patinpExEntity = new EntityFactory(con, queryString);
        return patinpExEntity.findMultiple(inputParas);
    }

    // 取得某病歷號 & 住院序號，，住院錄中[所有診斷碼]相關資料
    public List<Map<String, Object>> queryInpDisListByChartNoSerno(int chartNo, int serno) throws SQLException {
        List<Map<String, Object>> resultMapList = new ArrayList<>();
        List<Map<String, Object>> dis9MapList = new ArrayList<>();
        List<Map<String, Object>> dis10MapList = new ArrayList<>();

        // query opd dis9
        dis9MapList = queryInpDis9ListByChartNoSerno(chartNo, serno);
        // query opd dis10
        dis10MapList = queryInpDis10ListByChartNoSerno(chartNo, serno);

        resultMapList.addAll(dis9MapList);
        resultMapList.addAll(dis10MapList);

        return resultMapList;
    }


    // 取得某病歷號 & 住院序號，[主診斷碼]相關資料
    public Map<String, Object> queryInpMainDisByChartNoSerno(int chartNo, int serno) throws SQLException {
        List<Map<String, Object>> inpDisMapList;
        Optional<Map<String, Object>> optionalMap = Optional.of(new LinkedHashMap<>());
        Map<String, Object> resultMap = new LinkedHashMap<>();

        inpDisMapList = queryInpDisListByChartNoSerno(chartNo, serno);

        if (!inpDisMapList.isEmpty()) {
            optionalMap = inpDisMapList.stream()
                    .filter(map -> castToInt(map.get("rec_count")) == 1)
                    .findAny();
        }
        
        if (optionalMap.isPresent()) {
            resultMap = optionalMap.get();
        }

        return resultMap;
    }


    public static void main(String[] args) {
        Connection myConnection = null;
        JDBCUtilities jdbcUtil = new JDBCUtilities();
        String resultStrng;

        try {
            myConnection = jdbcUtil.getConnection();
            PatinpEX patinpEx = new PatinpEX(myConnection);

            int chartNo;
            int serno;


            chartNo = 912473;
            serno = 107689;
            System.out.printf("\nPatinpEx.queryOpdDisListByChartNoDateRange chartNo=%d serno=%d JsonArray:%s ",
                    chartNo, serno, MapUtil.listMapToJsonArray(patinpEx.queryInpDisListByChartNoSerno(chartNo, serno)).toString());

            chartNo = 912473;
            serno = 107689;
            System.out.printf("\nPatinpEx.queryInpMainDisByChartNoSerno chartNo=%d serno=%d JsonObject:%s ",
                    chartNo, serno, MapUtil.mapToJsonObject(patinpEx.queryInpMainDisByChartNoSerno(chartNo, serno)).toString());

        } catch (SQLException ex) {
            JDBCUtilities.printSQLException(ex);
        } finally {
            if (myConnection != null) {
                JDBCUtilities.closeConnection(myConnection);
            }
        }
    }
}

