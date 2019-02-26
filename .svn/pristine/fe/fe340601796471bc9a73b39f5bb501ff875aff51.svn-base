package library.utility;

import com.google.gson.JsonNull;
import com.google.gson.JsonObject;

import java.math.BigDecimal;
import java.sql.*;
import java.util.*;
import java.util.stream.Collectors;


/**
 * Created by jeffy on 2017/5/11.
 */
public class TableUtil {
    protected Connection connection;

    public TableUtil(Connection connection) {
        this.connection = connection;
    }

    public List<String> getPKColNames(String tableName) throws SQLException {
        List<String> pkColNames = new ArrayList<>();
        DatabaseMetaData dbmd = connection.getMetaData();
        ResultSet resultSet = dbmd.getPrimaryKeys(null, null, tableName.toUpperCase());
        Map<String, Integer> colSeqMap = new LinkedHashMap<>();

        while (resultSet.next()) {
            colSeqMap.put(resultSet.getString("COLUMN_NAME").toLowerCase(), resultSet.getInt("KEY_SEQ"));
        }

        Comparator<Map.Entry<String, Integer>> byKeySeq = Comparator.comparing(Map.Entry::getValue);

        pkColNames = colSeqMap.entrySet().stream()
                .sorted(byKeySeq)
                .map(Map.Entry::getKey)
                .collect(Collectors.toList());

//        System.out.println("PKColNames : " + pkColNames);
        return pkColNames;
    }

    public List<Map<String, Object>> getTableMetaData(String tableName) throws SQLException {
        List<Map<String, Object>> tableMetaData = new ArrayList<>();
        List<String> pkColNames = getPKColNames(tableName);

        String sqlString = " SELECT * FROM " + tableName.toUpperCase() + " WHERE rownum < 1 ";
        PreparedStatement queryStmt = connection.prepareStatement(sqlString, ResultSet.TYPE_SCROLL_INSENSITIVE, ResultSet.CONCUR_READ_ONLY);
        ResultSet resultSet = queryStmt.executeQuery();
        ResultSetMetaData rsmd = resultSet.getMetaData();

        for (int i = 1; i <= rsmd.getColumnCount(); i++) {
            Map<String, Object> rsmdMap = new LinkedHashMap<>();
            rsmdMap.put("columnName", rsmd.getColumnName(i).toLowerCase());
            rsmdMap.put("columnType", rsmd.getColumnType(i));
            rsmdMap.put("columnTypeName", rsmd.getColumnTypeName(i));
            rsmdMap.put("columnClassName", rsmd.getColumnClassName(i));
            rsmdMap.put("isNullable", rsmd.isNullable(i));
            rsmdMap.put("precision", rsmd.getPrecision(i));
            rsmdMap.put("scale", rsmd.getScale(i));

            if (pkColNames.contains(rsmd.getColumnName(i).toLowerCase())) {
                rsmdMap.put("isPrimaryKey", 1);
            } else {
                rsmdMap.put("isPrimaryKey", 0);
            }
            tableMetaData.add(rsmdMap);
        }
        return tableMetaData;
    }

    public List<String> getNoNullColNames(List<Map<String, Object>> tableMetaData) {
        List<String> noNullColNames = new ArrayList<>();

        for (Map<String, Object> map : tableMetaData) {
            if (map.get("isNullable").equals(0)) {
                noNullColNames.add(MapUtil.castToStr(map.get(("columnName"))));
            }
        }
        return noNullColNames;
    }

    public List<String> getTableColNames(List<Map<String, Object>> tableMetaData) {
        List<String> tableColNames = new ArrayList<>();

        for (Map<String, Object> map : tableMetaData) {
            tableColNames.add(MapUtil.castToStr(map.get(("columnName"))));
        }
        return tableColNames;
    }

    private List<List<String>> checkMissingColsAndValues(List<String> colNames, Map<String, Object> dataParametersMap) {
        List<List<String>> result = new ArrayList<>();
        List<String> missingNoNullCols = new ArrayList<>();
        List<String> missingNoNullColValues = new ArrayList<>();
        for(int i = 0; i < colNames.size(); i++) {
            if (!dataParametersMap.containsKey(colNames.get(i))) {
                missingNoNullCols.add(colNames.get(i));
            } else {
                if (dataParametersMap.get(colNames.get(i)) == null) {
                    missingNoNullColValues.add(colNames.get(i));
                }
            }
        }

        result.add(missingNoNullCols);
        result.add(missingNoNullColValues);

        return result;
    }

    public String checkPKColsMissing(List<String> pkColNames, Map<String, Object> dataMap) {
        String result = "";
        List<List<String>> errorList = checkMissingColsAndValues(pkColNames, dataMap);

        if (errorList.get(0).size() > 0) {
            result = result + "Primary Key Cols missing: " + errorList.get(0).toString();
        }
        if (errorList.get(1).size() > 0) {
            result = result + "\nPrimary Key Col Values missing: " + errorList.get(1).toString();
        }
        return result;
    }

    public String checkNoNullColsMissing(List<String> noNullColNames, Map<String, Object> dataMap) {
        String result = "";
        List<List<String>> errorList = checkMissingColsAndValues(noNullColNames, dataMap);

        if (errorList.get(0).size() > 0) {
            result = result + "NoNull Cols missing: " + errorList.get(0).toString();
        }
        if (errorList.get(1).size() > 0) {
            result = result + "\nNoNull Col Values missing: " + errorList.get(1).toString();
        }
        return result;
    }

    public List<Integer> getPrecisionScale(String numString) {
        List<Integer> result = new ArrayList<>();
        boolean notException = true;

        if (notException) {
            try {
                result.add(BigDecimal.valueOf(Integer.valueOf(numString)).precision());
                result.add(BigDecimal.valueOf(Integer.valueOf(numString)).scale());
                notException = false;
            } catch (Exception e1) {
                // do nothing
            }
        }

        if (notException) {
            try {
                result.add(BigDecimal.valueOf(Long.valueOf(numString)).precision());
                result.add(BigDecimal.valueOf(Long.valueOf(numString)).scale());
                notException = false;
            } catch (Exception e2) {
                // do nothing
            }
        }

        if (notException) {
            try {
                result.add(BigDecimal.valueOf(Double.valueOf(numString)).precision());
                result.add(BigDecimal.valueOf(Double.valueOf(numString)).scale());
                notException = false;
            } catch (Exception e3) {
                // do nothing
            }
        }

        if (notException) {
            result.add(0);
            result.add(0);
        }

        return result;
    }

    public String checkValueConstrains(List<Map<String, Object>> tableMetaData, Map<String, Object> parametersMap) {
        String result = "";

        for (Map.Entry<String, Object> entry : parametersMap.entrySet()) {
            // check entry key is a table column
            Map<String, Object> colMetaData =  tableMetaData.stream()
                    .filter(m -> m.containsValue(entry.getKey()))
                    .findAny()
                    .orElse(null);

            // escape not a table column or data value is null
            if (colMetaData == null || entry.getValue() == null) continue;

            String columnName = MapUtil.castToStr(colMetaData.get("columnName"));
            String columnTypeName = MapUtil.castToStr(colMetaData.get("columnTypeName"));
            String columnClassName = MapUtil.castToStr(colMetaData.get("columnClassName"));
            int isNullable = MapUtil.castToInt(colMetaData.get("isNullable"));
            int precision = MapUtil.castToInt(colMetaData.get("precision"));
            int scale = MapUtil.castToInt(colMetaData.get("scale"));
            int isPrimaryKey = MapUtil.castToInt(colMetaData.get("isPrimaryKey"));

            // number type check
            List<String> numberTypes = Arrays.asList("NUMBER", "INTEGER", "FLOAT", "DECIMAL", "DOUBLEPRECISION", "INT", "NUMERIC", "REAL", "SMALLINT" );
            if (numberTypes.contains(columnTypeName)) {
                String numString = String.valueOf(entry.getValue());

                List<Integer> precisionScale = getPrecisionScale(numString);
                if (precisionScale.get(0) == 0 && precisionScale.get(1) == 0) {
                    result = result + " " + columnName + " Value not numbers. ";
                }
                if (precisionScale.get(1) > scale) {
                    result = result + " " + columnName + " Value part of scale exceed length " + scale + ". ";
                }
                if (precisionScale.get(0) > precision) {
                        result = result + " " + columnName + " Value part of precision exceed length " + precision + ". ";
                }
            }

            // String type check
            List<String> stringTypes = Arrays.asList("VARCHAR2", "NVARCHAR2", "VARCHAR", "NVARCHAR", "CHAR", "LONG");
            if (stringTypes.contains(columnTypeName)) {
                if (MapUtil.castToStr(entry.getValue()).length() > precision) {
                    result = result + " " + columnName + " Value exceed max length " + precision + ". ";
                }
            }

            // Binary Check
            //List<String> byteTypes = Arrays.asList("LONG RAW", "RAW");
            // to do ...

            // Date time check
            //List<String> dateTypes = Arrays.asList("DATE");
            // to do ...

        }
        return result;
    }

    public static void main(String[] args) {
        Connection myConnection = null;
        JDBCUtilities jdbcUtil = new JDBCUtilities();
        JsonObject dataJsObject = new JsonObject();

        try {
            myConnection = jdbcUtil.getConnection();
            TableUtil tableUtil = new TableUtil(myConnection);

            dataJsObject.addProperty("chart_no", 1760070000L);
//            dataJsObject.add("chart_no", JsonNull.INSTANCE);
            dataJsObject.addProperty("serno", 2973480000L);
            dataJsObject.addProperty("assess_date", "104080201");
            dataJsObject.addProperty("assess_time", "041506");
            dataJsObject.addProperty("temperature", 38.2);
            dataJsObject.addProperty("systolic_pressure", 118);
            dataJsObject.addProperty("diastolic_pressure", 78.1);
            dataJsObject.addProperty("pulse", 76);
            dataJsObject.addProperty("respiration", 18);
            //dataJsObject.addProperty("weight", 65.6);
            dataJsObject.add("weight", JsonNull.INSTANCE);
            dataJsObject.addProperty("iv_fluids", 250);
            dataJsObject.addProperty("urine", 300);
            dataJsObject.addProperty("stool", "1E / 1D");
            dataJsObject.addProperty("keyin_clerk", "ORCL");
            dataJsObject.addProperty("keyin_date", "1040802");
            dataJsObject.addProperty("keyin_time", "0420");

            Map<String, Object> dataMap = MapUtil.jsonObjectToMap(dataJsObject);

            String tableName = "tprrecord";
            List<Map<String, Object>> tableMetaData = tableUtil.getTableMetaData(tableName);
            System.out.println("TableMetaData : " + tableName + " ListOfMap: " + tableMetaData);

            List<String> pkColNames = tableUtil.getPKColNames(tableName);
            System.out.println("PKColNames : " + pkColNames);

            List<String> noNullColNames = tableUtil.getNoNullColNames(tableMetaData);
            System.out.println("NoNullColNames : " + noNullColNames);

            String checkMessages = "";

            // Check dataMap contains Primary Cols and Values not null
            checkMessages =  checkMessages + tableUtil.checkPKColsMissing(pkColNames, dataMap);

            // Check dataMap contains NoNull Cols and Values not null
            checkMessages = checkMessages + tableUtil.checkNoNullColsMissing(noNullColNames, dataMap);

            // Check dataMap Value Length and Type
            checkMessages = checkMessages + tableUtil.checkValueConstrains(tableMetaData, dataMap);

            if (checkMessages.isEmpty() || checkMessages == null) {
                System.out.println("checkPKColsMissing & checkNoNullColsMissing & dataCheck.checkValueConstrains Passed");
            } else {
                System.out.println("checkMessage: " + checkMessages);
            }

        } catch (SQLException ex) {
            JDBCUtilities.printSQLException(ex);
        } catch (Exception ex) {
            System.out.println(ex.getStackTrace());
        } finally {
            if (myConnection != null) { JDBCUtilities.closeConnection(myConnection); }
        }
    }
}
