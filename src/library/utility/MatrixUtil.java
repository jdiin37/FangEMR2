package library.utility;

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;

import java.util.*;
import java.util.stream.Collectors;

/**
 * Created by jeffy on 2017/6/27.
 */
public class MatrixUtil {
    private String xAxialName;
    private String yAxialName;
    private String cellName;
    private List<Object> xAxialValues;
    private List<Object> yAxialValues;
    private List<Map<String, Object>> sourceObjects;
    private List<Map<String, Object>> matrixObjects;

    public MatrixUtil(List<Map<String, Object>> sourceObjects, String xAxialName, String yAxialName, String cellName) {
        this.xAxialName = xAxialName;
        this.yAxialName = yAxialName;
        this.cellName = cellName;
        this.sourceObjects = sourceObjects;
    }

    private void initCheck() throws Exception {
        if (xAxialName == null) throw new Exception("xAxialName is null. ");

        if (yAxialName == null) throw new Exception("yAxialName is null. ");

        if (cellName == null) throw new Exception("cellName is null. ");

        if (sourceObjects.size() == 0) throw new Exception("Source Objects is empty. ");

        if (sourceObjects.stream().noneMatch(m -> m.containsKey(this.xAxialName)))
            throw new Exception("xAxialName not present in Source Objects. ");

        if (sourceObjects.stream().noneMatch(m -> m.containsKey(this.yAxialName)))
            throw new Exception("yAxialName not present in Source Objects. ");

        if (sourceObjects.stream().noneMatch(m -> m.containsKey(this.cellName)))
            throw new Exception("cellName not present in Source Objects. ");
    }

    private List<Object> getAxialValues(String axialName) {
        return sourceObjects.stream()
                .filter(m -> m.containsKey(axialName))
                .map(m -> m.get(axialName))
                .distinct()
                .sorted()
                .collect(Collectors.toList());
    }

    private void setxAxialValues() {
        this.xAxialValues = getAxialValues(this.xAxialName);
    }

    private void setyAxialValues() {
        this.yAxialValues = getAxialValues(this.yAxialName);
    }

    private void createMatrixWithPlaceHolders() {
        this.matrixObjects =
                xAxialValues.stream()
                        .flatMap(x -> yAxialValues.stream().map(y -> {
                            Map<String, Object> map = new LinkedHashMap<>();
                            map.put(this.xAxialName, x);
                            map.put(this.yAxialName, y);
                            map.put(this.cellName, null);
                            return map;}))
                        .collect(Collectors.toList());
    }

    private void mergeMatrixWithSourceValues(){
        List<String> keyList = Arrays.asList(xAxialName, yAxialName);
        Map<String, Object> conditonMap;
        Object cellValue;

        for (Map<String, Object> map : matrixObjects) {
            conditonMap = MapEntryUtil.getSubMapByKeyListAndPadding(map, keyList);
            for (Map.Entry<String, Object> entry : map.entrySet()) {
                Map<String, Object> finalConditonMap = conditonMap;
                cellValue = sourceObjects.stream()
                        .filter(m -> MapEntryUtil.isContainsEntries(m, finalConditonMap))
                        .map(s -> s.get(cellName))
                        .findAny().orElse(null);
                if (cellValue != null) map.put(cellName, cellValue);
            }
        }
    }


    public List<Map<String, Object>> getMatrixObjects() {
        try {
            initCheck();       // Check input Source Objects, x-axialName, y-axialName, cell_name
            setxAxialValues(); // Create x-AxialValues
            setyAxialValues(); // Create y-AxialValues
            createMatrixWithPlaceHolders(); // Create Matrix Objects by x-AxialValues, y-AxialValues and empty cellValues
            mergeMatrixWithSourceValues(); // Merge Source Objects' cellValue to Matrix Objects' cellValue
        } catch (Exception ex) {
            ex.printStackTrace();
        }

        return matrixObjects;
    }

    public List<Map<String, Object>> mergeMapFromSourceToTarget(List<Map<String, Object>> sourceObjects, List<Map<String, Object>> targetObjects, List<String> keyListToAdd, List<String> criteriaKeys) {
        List<Map<String, Object>> result = new ArrayList<>();
        Map<String, Object> criteriaMap = new LinkedHashMap<>();

        for (Map<String, Object> targetMap : targetObjects) {
            for (String key : criteriaKeys) {
                criteriaMap.put(key, targetMap.get(key));
            }

            for (Map<String, Object> sourceMap : sourceObjects) {
                if (MapEntryUtil.isContainsEntries(sourceMap, criteriaMap)) {
                    targetMap.putAll(MapEntryUtil.getSubMapByKeyListAndPadding(sourceMap, keyListToAdd));
                    break;
                }
            }
            result.add(targetMap);
        }

        return result;
    }

    public static void main(String[] args) {
        // Make a matrix from source maps by xAxialName and yAxialName and cellName

        // 1. get List of Map from Database
        String jsonString = "[{\"chart_no\":176007,\"serno\":138853,\"seq_no\":333513,\"lab_type\":\"04\",\"report_date\":\"0980717\",\"report_time\":\"1523\",\"lab_item\":\"HGB\",\"lab_value\":\"11.4\",\"unit\":\"g/dL\",\"start_value\":\"12\",\"end_value\":\"16\"},{\"chart_no\":176007,\"serno\":138853,\"seq_no\":333780,\"lab_type\":\"04\",\"report_date\":\"0980720\",\"report_time\":\"0906\",\"lab_item\":\"HGB\",\"lab_value\":\"10.8\",\"unit\":\"g/dL\",\"start_value\":\"12\",\"end_value\":\"16\"},{\"chart_no\":176007,\"serno\":297348,\"seq_no\":681659,\"lab_type\":\"04\",\"report_date\":\"1040801\",\"report_time\":\"2154\",\"lab_item\":\"HGB\",\"lab_value\":\"11.9\",\"unit\":\"g/dL\",\"start_value\":\"12\",\"end_value\":\"16\"},{\"chart_no\":176007,\"serno\":297348,\"seq_no\":682003,\"lab_type\":\"04\",\"report_date\":\"1040804\",\"report_time\":\"0854\",\"lab_item\":\"HGB\",\"lab_value\":\"10.4\",\"unit\":\"g/dL\",\"start_value\":\"12\",\"end_value\":\"16\"},{\"chart_no\":176007,\"serno\":138853,\"seq_no\":333513,\"lab_type\":\"04\",\"report_date\":\"0980717\",\"report_time\":\"1523\",\"lab_item\":\"MCH\",\"lab_value\":\"30.1\",\"unit\":\"pg\",\"start_value\":\"27\",\"end_value\":\"31\"},{\"chart_no\":176007,\"serno\":138853,\"seq_no\":333780,\"lab_type\":\"04\",\"report_date\":\"0980720\",\"report_time\":\"0906\",\"lab_item\":\"MCH\",\"lab_value\":\"29.8\",\"unit\":\"pg\",\"start_value\":\"27\",\"end_value\":\"31\"},{\"chart_no\":176007,\"serno\":297348,\"seq_no\":681659,\"lab_type\":\"04\",\"report_date\":\"1040801\",\"report_time\":\"2154\",\"lab_item\":\"MCH\",\"lab_value\":\"29.3\",\"unit\":\"pg\",\"start_value\":\"27\",\"end_value\":\"31\"},{\"chart_no\":176007,\"serno\":297348,\"seq_no\":682003,\"lab_type\":\"04\",\"report_date\":\"1040804\",\"report_time\":\"0854\",\"lab_item\":\"MCH\",\"lab_value\":\"29.5\",\"unit\":\"pg\",\"start_value\":\"27\",\"end_value\":\"31\"},{\"chart_no\":176007,\"serno\":138853,\"seq_no\":333513,\"lab_type\":\"04\",\"report_date\":\"0980717\",\"report_time\":\"1523\",\"lab_item\":\"MCV\",\"lab_value\":\"90.8\",\"unit\":\"fl\",\"start_value\":\"80\",\"end_value\":\"100\"},{\"chart_no\":176007,\"serno\":138853,\"seq_no\":333780,\"lab_type\":\"04\",\"report_date\":\"0980720\",\"report_time\":\"0906\",\"lab_item\":\"MCV\",\"lab_value\":\"89.8\",\"unit\":\"fl\",\"start_value\":\"80\",\"end_value\":\"100\"},{\"chart_no\":176007,\"serno\":297348,\"seq_no\":681659,\"lab_type\":\"04\",\"report_date\":\"1040801\",\"report_time\":\"2154\",\"lab_item\":\"MCV\",\"lab_value\":\"87.9\",\"unit\":\"fl\",\"start_value\":\"80\",\"end_value\":\"100\"},{\"chart_no\":176007,\"serno\":297348,\"seq_no\":682003,\"lab_type\":\"04\",\"report_date\":\"1040804\",\"report_time\":\"0854\",\"lab_item\":\"MCV\",\"lab_value\":\"87.2\",\"unit\":\"fl\",\"start_value\":\"80\",\"end_value\":\"100\"},{\"chart_no\":176007,\"serno\":2,\"seq_no\":672231,\"lab_type\":\"392\",\"report_date\":\"1040615\",\"report_time\":\"1743\",\"lab_item\":\"PC\",\"lab_value\":\"130\",\"unit\":\"mg/dL\",\"start_value\":\"70\",\"end_value\":\"140\"},{\"chart_no\":176007,\"serno\":1,\"seq_no\":674441,\"lab_type\":\"392\",\"report_date\":\"1040626\",\"report_time\":\"2056\",\"lab_item\":\"PC\",\"lab_value\":\"94\",\"unit\":\"mg/dL\",\"start_value\":\"70\",\"end_value\":\"140\"},{\"chart_no\":176007,\"serno\":2,\"seq_no\":677674,\"lab_type\":\"392\",\"report_date\":\"1040713\",\"report_time\":\"1534\",\"lab_item\":\"PC\",\"lab_value\":\"92\",\"unit\":\"mg/dL\",\"start_value\":\"70\",\"end_value\":\"140\"},{\"chart_no\":176007,\"serno\":1,\"seq_no\":681014,\"lab_type\":\"392\",\"report_date\":\"1040729\",\"report_time\":\"2149\",\"lab_item\":\"PC\",\"lab_value\":\"132\",\"unit\":\"mg/dL\",\"start_value\":\"70\",\"end_value\":\"140\"},{\"chart_no\":176007,\"serno\":297348,\"seq_no\":681658,\"lab_type\":\"392\",\"report_date\":\"1040801\",\"report_time\":\"2154\",\"lab_item\":\"PC\",\"lab_value\":\"121\",\"unit\":\"mg/dL\",\"start_value\":\"70\",\"end_value\":\"140\"},{\"chart_no\":176007,\"serno\":1,\"seq_no\":305969,\"lab_type\":\"41\",\"report_date\":\"0971218\",\"report_time\":\"1103\",\"lab_item\":\"PH\",\"lab_value\":\"6.0\",\"unit\":null,\"start_value\":null,\"end_value\":null},{\"chart_no\":176007,\"serno\":138853,\"seq_no\":333770,\"lab_type\":\"01\",\"report_date\":\"0980719\",\"report_time\":\"1207\",\"lab_item\":\"PH\",\"lab_value\":\"5.0\",\"unit\":null,\"start_value\":null,\"end_value\":null},{\"chart_no\":176007,\"serno\":297348,\"seq_no\":681862,\"lab_type\":\"01\",\"report_date\":\"1040803\",\"report_time\":\"1615\",\"lab_item\":\"PH\",\"lab_value\":\"6.0\",\"unit\":null,\"start_value\":null,\"end_value\":null}]";
        List<Map<String, Object>> sourceObjects = MapUtil.jsonArrayToListMap(MapUtil.strToJsonArray(jsonString));
        System.out.println("Source Objects: " + MapUtil.listMapToJsonArray(sourceObjects));

        // 2. get matrix List of Map from Source Object with x-AxialName, y-AxialName, cellName
        MatrixUtil matrixUtil = new MatrixUtil(sourceObjects, "lab_item", "report_date", "lab_value");
        List<Map<String, Object>> matrixObjects = matrixUtil.getMatrixObjects();
        System.out.println("Matrix Objects: " + MapUtil.listMapToJsonArray(matrixObjects));

        // 3. add maps from Source Object with keyListToAdd, criteriaKeys
        List<String> keyListToAdd = Arrays.asList("chart_no", "unit", "start_value", "end_value");
        List<String> criteriaKeys = Arrays.asList("lab_item");
        List<Map<String, Object>> resultObjects = matrixUtil.mergeMapFromSourceToTarget(sourceObjects, matrixObjects, keyListToAdd, criteriaKeys);
        System.out.println("Result Objects: " + MapUtil.listMapToJsonArray(resultObjects));

        // 4. produce master detail data from List of Map with masterCols, detailCols
        List<String> masterCols = Arrays.asList("chart_no", "lab_item", "unit", "start_value", "end_value");
        List<String> detailCols = Arrays.asList("report_date", "lab_value");
        JsonArray jsonArray = MapGroupingUtil.groupListMapToJsonArray(MapGroupingUtil.getGroupingResultMap(resultObjects, masterCols, detailCols));
        System.out.println("Json Array: " + jsonArray);

        // 5. add status success
        JsonObject jsonObject = MapUtil.getSuccessResult(jsonArray);
        System.out.println("Json Object: " + jsonObject);
    }
}
