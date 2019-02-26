package library.utility;

import static org.junit.Assert.*;
import java.util.*;
import java.util.function.BiFunction;

/**
 * Created by jeffy on 2017/6/22.
 */
public class MapEntryUtil {

    public static <K, V> Map.Entry<K, V> createMapEntry(K key, V value) {
        return new AbstractMap.SimpleEntry<K, V>(key, value);
    }

    public static <K, V> Map.Entry<K, V> getEntryByKey(Map<K, V> sourceMap, K key) {
        return sourceMap.entrySet().stream().filter(e -> e.getKey().equals(key)).findAny().orElse(null);
    }

    public static <K, V>  boolean isContainsEntry(Map<K, V> sourceMap, Map.Entry<K, V> entry) {
        Map.Entry<K, V> filterEntry = sourceMap.entrySet().stream()
                .filter(e -> e.getKey().equals(entry.getKey()) && e.getValue().equals(entry.getValue()))
                .findAny().orElse(null);

        return filterEntry != null;
    }

    public static <K, V> boolean isContainsEntries(Map<K, V> sourceMap, Map<K, V> conditionMap) {
        long l = sourceMap.entrySet().stream()
                .filter(e -> conditionMap.containsKey(e.getKey()) && conditionMap.containsValue(e.getValue()))
                .count();

        return (long)conditionMap.size() == l;
    }

    public static <K, V> void paddingNullByKeyList(Map<K, V> map, List<K> keyList) {
        keyList.forEach(s -> map.put(s, map.get(s)));
    }

    public static <K, V> Map<K, V> orderingMapByKeySequence(Map<K, V> map, List<K> keyList) {
        Map<K, V> result = new LinkedHashMap<>();
        for (K key : keyList) {
            if (map.containsKey(key)) {
                result.put(key, map.get(key));
            }
        }
        return result;
    }
    
    public static <K, V> List<V> getMapValuesByKeyList(Map<K, V> sourceMap, List<K> keyList) {
        List<V> result = new ArrayList<>();
        for (K key : keyList) {
            result.add(sourceMap.getOrDefault(key, null));
        }
        return result;
    }

    public static <K, V> Map<K, V> getSubMapByKeyList(Map<K, V> sourceMap, List<K> keyList) {
        Map<K, V> subMap = new LinkedHashMap<>();
        sourceMap.entrySet().stream()
                .filter(e -> keyList.contains(e.getKey()))
                .forEach(e -> subMap.put(e.getKey(), e.getValue()));
        return orderingMapByKeySequence(subMap, keyList);
    }

    public static <K, V> Map<K, V> getSubMapByKeyListAndPadding(Map<K, V> sourceMap, List<K> keyList) {
        Map<K, V> subMap = getSubMapByKeyList(sourceMap, keyList);
        paddingNullByKeyList(subMap, keyList);
        return orderingMapByKeySequence(subMap, keyList);
    }

    private static <T, U> Map<T, U> createMap(List<T> keys, List<U> values, BiFunction<T, U, Map.Entry<T, U>> f) {
        Map<T, U> results = new LinkedHashMap<>();
        for (T key : keys) {
            Map.Entry<T, U> entry = f.apply(key, values.get(keys.indexOf(key)));
            results.put(entry.getKey(), entry.getValue());
        }
        return results;
    }

    public static <T, U> Map<T, U> createMap(List<T> keys, List<U> values) {
        if (keys.isEmpty() || values.isEmpty()) throw new NullPointerException("List of Key or List of Value is Empty");
        return createMap(keys, values, AbstractMap.SimpleEntry::new);
    }

    public static void main(String[] args) {
        long start;

        List<String> keyList1 = Arrays.asList("chart_no", "pt_name", "id_no", "birth_date", "sex", "pt_type");
        List<Object> valueList1 = Arrays.asList(6223, "someOne", "N111111111", "0630108", 2, 21);
        Map<String, Object> map = createMap(keyList1, valueList1);
        System.out.println("Map:" + map);

        Map.Entry<String, Object> entry = getEntryByKey(map, "birth_date");
        assertEquals(entry.getKey(), "birth_date");
        assertEquals(entry.getValue(), "0630108");

        entry = new AbstractMap.SimpleEntry<>("chart_no", 6223);
        boolean bool;
        bool = isContainsEntry(map, entry);
        assertTrue(bool);

        entry = new AbstractMap.SimpleEntry<>("birth_date", "06301080000");
        bool = isContainsEntry(map, entry);
        assertFalse(bool);

        Map<String, Object> testMap = new LinkedHashMap<>();
        testMap.put("chart_no", 6223);
        testMap.put("pt_name", "someOne");
        bool = isContainsEntries(map, testMap);
        System.out.println("testMap:" + testMap);
        assertTrue(bool);

        testMap.put("chart_no", 6223111);
        testMap.put("pt_name", "someOne");
        bool = isContainsEntries(map, testMap);
        System.out.println("testMap:" + testMap);
        assertFalse(bool);

        Map<String, Object> result;
        List<String> keyList = Arrays.asList("chart_no", "pt_name", "id_no", "notExistKey");
        System.out.println("keyList: " + keyList);

        start = System.nanoTime();
        result = getSubMapByKeyList(map, keyList);
        System.out.println("Get map by key list:" + result);
        System.out.println("Get map by key list Duration:" + (System.nanoTime() - start) / 1_000_000 + " msec.");
        assertEquals(3, result.size());

        start = System.nanoTime();
        result = getSubMapByKeyListAndPadding(map, keyList);
        System.out.println("Get map by key list And Padding:" + result);
        System.out.println("Get map by key list And Padding Duration:" + (System.nanoTime() - start) / 1_000_000 + " msec.");
        assertEquals(4, result.size());

        keyList = Arrays.asList("notExistKey", "chart_no", "pt_name", "id_no");
        System.out.println("Original Map:" + result);
        System.out.println("Key list:" + keyList);
        Map<String, Object> orderedMap = orderingMapByKeySequence(result, keyList);
        System.out.println("Ordering Map:" + orderedMap);

        assertEquals(getEntryByKey(result, "notExistKey").getKey(), "notExistKey");
        assertEquals(getEntryByKey(result, "notExistKey").getValue(), null);

    }

}
