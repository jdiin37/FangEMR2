package library.utility;

import java.sql.*;
import java.util.*;
import java.util.stream.Collectors;


/**
 * Created by jeffy on 2017/3/29.
 */
public class EntityFactory {
    private final String sqlString;
    protected Connection connection;

    public EntityFactory(Connection connection, String sqlString) {
        this.sqlString = sqlString;
        this.connection = connection;
    }

    public Map<String, Object> findSingle(Object[] params) throws SQLException {
        Map<String, Object> object = new LinkedHashMap<>();
        List<Map<String, Object>> objects = this.findMultiple(params);

        if (objects.size() >= 1) {
            object = objects.get(0); //extract only the first item;
        }

        return object;
    }

    public List<Map<String, Object>> findMultiple(Object[] params) throws SQLException {
        ResultSet resultSet = null;
        PreparedStatement queryStmt = null;
        List<Map<String, Object>> objects = new ArrayList<>();
        try {
            //System.out.println("sqlString= " + sqlString);
            queryStmt = connection.prepareStatement(sqlString, ResultSet.TYPE_SCROLL_INSENSITIVE, ResultSet.CONCUR_READ_ONLY);
            queryStmt.clearParameters();
            for (int i = 0; i < params.length; i++) {
                //System.out.println("params[" + i + "]= " + params[i]);
                queryStmt.setObject(i + 1, params[i]);
            }            
            resultSet = queryStmt.executeQuery();
            objects = getEntitiesFromResultSet(resultSet);
        } catch (SQLException ex) {
            JDBCUtilities.printSQLException(ex);
        } finally {
            if (resultSet != null) { JDBCUtilities.closeResultSet(resultSet); }
            if (queryStmt != null) { JDBCUtilities.closeStatement(queryStmt); }
        }
        return objects;
    }

    public Map<String, Object> upsertSingle(List<Object> params) throws SQLException {
        int count = 0;
        String errorMessage = "";
        Map<String, Object> result = new LinkedHashMap<>();
        PreparedStatement upsertStmt = null;

        try {
            //System.out.println("sqlString= " + sqlString);
            upsertStmt = connection.prepareStatement(sqlString, ResultSet.TYPE_SCROLL_INSENSITIVE, ResultSet.CONCUR_READ_ONLY);
            upsertStmt.clearParameters();

            for (int i = 0; i < params.size(); i++) {
                //System.out.println("params[" + i + "]= " + params[i]);
                upsertStmt.setObject(i + 1, params.get(i));
            }
            
            count = upsertStmt.executeUpdate();
            
        } catch (SQLException ex) {
            JDBCUtilities.printSQLException(ex);
            errorMessage = ex.getMessage();
        } finally {
            if (upsertStmt != null) { JDBCUtilities.closeStatement(upsertStmt); }
        }

        result.put("count", count);
        result.put("errorMessage", errorMessage);

        return result;
    }

    public List<Map<String, Object>> upsertMultiple(List<List<Object>> listParams) throws SQLException {
        List<Map<String, Object>> result = new ArrayList<>();
        for (List<Object> params : listParams) {
            result.add(this.upsertSingle(params));
        }

        return result;
    }

    public List<Integer> batchUpsert(List<List<Object>> listParams) throws SQLException {
        int[] updateCounts = new int[listParams.size()];
        List<Integer> result = new ArrayList<>(listParams.size());
        PreparedStatement upsertStmt = null;

        try {
            //System.out.println("sqlString= " + sqlString);
            upsertStmt = connection.prepareStatement(sqlString, ResultSet.TYPE_SCROLL_INSENSITIVE, ResultSet.CONCUR_READ_ONLY);
            upsertStmt.clearParameters();

            for (List<Object> params : listParams) {
                for (int i = 0; i < params.size(); i++) {
                    //System.out.println("params[" + i + "]= " + params[i]);
                    upsertStmt.setObject(i + 1, params.get(i));
                }
                upsertStmt.addBatch();
            }

            updateCounts = upsertStmt.executeBatch();

        } catch (BatchUpdateException bex) {
            JDBCUtilities.printBatchUpdateException(bex);
            updateCounts = bex.getUpdateCounts();
        } catch (SQLException ex) {
            JDBCUtilities.printSQLException(ex);
        } finally {
            if (upsertStmt != null) { JDBCUtilities.closeStatement(upsertStmt); }
        }

//        return IntStream.of(updateCounts).boxed().collect(Collectors.toList());
        return Arrays.stream(updateCounts).boxed().collect(Collectors.toList());
    }

    private List<Map<String, Object>> getEntitiesFromResultSet(ResultSet resultSet) throws SQLException {
        List<Map<String, Object>> entities = new ArrayList<>();
        while (resultSet.next()) {
            entities.add(getEntityFromResultSet(resultSet));
        }
        return entities;
    }

    private Map<String, Object> getEntityFromResultSet(ResultSet resultSet) throws SQLException {
        ResultSetMetaData metaData = resultSet.getMetaData();
        Map<String, Object> resultsMap = new LinkedHashMap<>();
        for (int i = 1; i <= metaData.getColumnCount(); i++) {
            String columnName = metaData.getColumnName(i).toLowerCase();
            Object object = resultSet.getObject(i);
            resultsMap.put(columnName, object);
        }
        return resultsMap;
    }

}
