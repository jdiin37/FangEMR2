package library.utility;

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;

import java.util.*;

/**
 * Created by jeffy on 2017/6/29.
 */
public class MapGroupingUtil {

    public static JsonObject groupMapToJsonObject(Map.Entry<Map<String, Object>, List<Map<String, Object>>> map) {
        JsonObject jsonObject;
        jsonObject = MapUtil.mapToJsonObject(map.getKey());
        jsonObject.add(MapUtil.KEY_DETAILDATA, MapUtil.listMapToJsonArray(map.getValue()));
        return jsonObject;
    }

    public static JsonArray groupListMapToJsonArray(Map<Map<String, Object>, List<Map<String, Object>>> resultMap) {
        JsonObject jsonObject;
        JsonArray jsonArray = new JsonArray();
        for (Map.Entry<Map<String, Object>, List<Map<String, Object>>> entry : resultMap.entrySet()) {
            jsonObject = groupMapToJsonObject(entry);
            jsonArray.add(jsonObject);
        }
        return jsonArray;
    }


    public static List<Map<String ,Object>> getMasterMap(List<Map<String, Object>> objects, List<String> keys) {
        List<Map<String, Object>> result = new ArrayList<>();
        Set<Map<String, Object>> set = new LinkedHashSet<>();

        for (Map<String, Object> map : objects) {
            Map<String, Object> tempMap = new LinkedHashMap<>();
            Map<String, Object> masterMap = new LinkedHashMap<>();

            for (Map.Entry<String, Object> entry : map.entrySet()) {
                if (keys.contains(entry.getKey())) {
                    tempMap.put(entry.getKey(), entry.getValue());
                }
            }

            // sorting Map by keys sequence
            for (String key : keys) {
                masterMap.put(key, tempMap.get(key));
            }
            set.add(masterMap);
        }

        result.addAll(set);

        return result;
    }

    public static List<Map<String, Object>> getDetailListMap(List<Map<String, Object>> objects, Map<String ,Object> groupMap) {
        List<Map<String, Object>> result = new ArrayList<>();
        Set<String> keys = groupMap.keySet();
        for (Map<String, Object> map : objects) {
            boolean exists = false;
            for (String key : keys) {
                if (MapUtil.nullToEmpty(map.getOrDefault(key, "_")).equals(MapUtil.nullToEmpty(groupMap.getOrDefault(key, "_")))) {
                    exists = true;
                } else {
                    exists = false;
                    break;
                }
            }
            if (exists) {
                result.add(map);
            }
        }
        return  result;
    }

    public static Map<Map<String, Object>, List<Map<String, Object>>> getGroupingResultMap(List<Map<String, Object>> objects, List<String> masterCols, List<String> detailCols) {
        Map<Map<String, Object>, List<Map<String, Object>>> result = new LinkedHashMap<>();
        List<Map<String, Object>> masterMap = getMasterMap(objects, masterCols);

        for (Map<String, Object> map : masterMap) {
            List<Map<String, Object>> detail = getDetailListMap(objects, map);
            objects.removeAll(detail);
            for (Map<String, Object> detailMap : detail) {
                detailMap.entrySet().removeIf(e -> !detailCols.contains(e.getKey()));
            }
            result.put(map, detail);
        }
        return result;
    }
    
}

