package com.example.queue.util;
import java.lang.reflect.Array;
import java.util.List;
import java.util.*;
import java.util.Map.Entry;
import java.util.regex.Pattern;

/**
 * <p>标题：Map 相关工具类 </p>
 * <p>功能： </p>
 * <p>版权： Copyright (c) 2012</p>
 * <p>公司: 北京南北天地科技股份有限公司</p>
 * <p>创建日期：2012-7-30 下午12:44:15</p>
 * <p>类全名：snsoft.rootbas.util.pub.MapUtil</p>
 * @author 王立鹏
 * @version 1.0
 */
public class MapUtil
{
	MapUtil()
	{
	}

	/**
	 * 将数组对象转化为链表
	 * @param objs
	 * @return
	 */
	public static <T> List<T> toArrayList(T... objs)
	{
		List<T> list = new ArrayList();
		for (int i = 0; i < objs.length; i++)
		{
			list.add(objs[i]);
		}
		return list;
	}

	/**
	 * 将kvs转换为Map。
	 * @param kvs
	 * 	key1,value1,key2,value2,,,，其中key必须为String类型且不为空。
	 * @return
	 */
	public static Map<String,Object> toHashMap(Object... kvs)
	{
		Map<String,Object> map = new HashMap();
		for (int i = 0; i < kvs.length; i += 2)
		{
			map.put((String) kvs[i], i + 1 < kvs.length ? kvs[i + 1] : null);
		}
		return map;
	}


	/**
	 * 将Map的一维数组值转化成二维数组。
	 * 其中不做任何处理。
	 * @param map
	 * @return
	 */
	public static Object[][] toArray(final Map<?,Object[]> map)
	{
		if (map == null)
		{
			return null;
		}
		return map.values().toArray(new Object[map.size()][]);
	}

	/**
	 * 将map转化成二维数组（会过滤空值）。
	 * @param map
	 * @return
	 */
	public static <T> T[][] toArrayT(final Map<?,T[]> map)
	{
		// 如果为空或者没有元素，则返回空
		if (map == null || map.isEmpty())
		{
			return null;
		}
		// 查找数组类型
		Class<?> clss = null;
		int size = 0;
		for (final T[] t : map.values())
		{
			if (t != null)
			{
				if (clss == null)
				{
					clss = t.getClass();
				}
				size++;
			}
		}
		// 如果数组类型为空，即所有的值为空，则返回空
		if (clss == null)
		{
			return null;
		}
		// 新建类型数组
		final T[][] tv = (T[][]) Array.newInstance(clss, size);
		int i = 0;
		for (final T[] t : map.values())
		{
			if (t != null)
			{
				tv[i++] = t;
			}
		}
		return tv;
	}

	/**
	 * 根据前缀返回源Map中符合条件的Entry组成的新Map。
	 * @param srcMap
	 * @param prefix
	 * @return
	 */
	public static Map<String,Object> filterKey(final Map<String,Object> srcMap, final String prefix)
	{
		return MapUtil.filterByKeyRegex(srcMap, prefix + ".*");
	}

	public static Map<String,Object> filterByKeyRegex(final Map<String,Object> srcMap, final String regex)
	{
		final Map<String,Object> tgtMap = new LinkedHashMap<>();
		if (srcMap != null && regex != null)
		{
			final Pattern ptn = Pattern.compile(regex);
			for (final Entry<String,Object> e : srcMap.entrySet())
			{
				if (ptn.matcher(e.getKey()).find())
				{
					tgtMap.put(e.getKey(), e.getValue());
				}
			}
		}
		return tgtMap;
	}

	/**
	 * 将from中的键如果在to中也包含则将to中的键值覆盖并返回；
	 * 算法：from若为null，则直接返回to;如果to为空则将from所有键值拷贝给to
	 * 例子：
	 * Map m1 = new HashMap();
	 * m1.put("1", 1);
	 * m1.put("2", 2);
	 * Map m2 = new HashMap();
	 * m2.put("2", 3);
	 * m2.put("4", 4);
	 * m2.put("5", 5);
	 * m2.put("6", 6);
	 * out.println(MapUtil.dupMapsIfNotNull(m1, m2));
	 * Console：{2=3, 1=1}
	 * @return 返回值为拷贝后的to
	 *         add by gml 2012/9/1
	 */
	@SuppressWarnings("unchecked")
	public static final Map dupMapsIfNotNull(Map to, final Map from)
	{
		if (from == null)
		{
			return to;
		}
		if (to == null)
		{
			to = new HashMap();
			to.putAll(from);
		} else
		{
			for (final Object key : to.keySet())
			{
				if (from.containsKey(key))
				{
					to.put(key, from.get(key));
				}
			}
		}
		return to;
	}

	public static final Map<String,Object> dupMapsIfValueNotNull(Map<String,Object> to, final Map<String,Object> from)
	{
		if (from == null)
		{
			return to;
		}
		if (to == null)
		{
			to = new HashMap<String,Object>();
		}
		for (final String key : from.keySet())
		{
			Object value = from.get(key);
			if (value != null)
			{
				to.put(key, value);
			}
		}
		return to;
	}

	/**
	 * @param
	 * @return
	 */
	public static Map toMap(final Map<String,Object> params)
	{
		final Map<String,Object> map = new TreeMap<>();
		if (params != null)
		{
			for (final Entry<String,Object> e : params.entrySet())
			{
				if (e.getKey().contains("["))
				{
					continue;
				}
				map.put(e.getKey(), e.getValue());
			}
		}
		return map;
	}


	public static final Map<String,Object> toStringMap(Map<String,Object> map, final String[] keyStrArray, final String[] valueStrArray, boolean isCheckLen)
	{
		if (map == null)
		{
			map = new HashMap<>();
		}
		if (keyStrArray == null || keyStrArray.length == 0 || valueStrArray == null || valueStrArray.length == 0)
		{
			return map;
		}
		if (isCheckLen && valueStrArray.length != keyStrArray.length)
		{
			//throw new java.lang.RuntimeException("参数长度不一致！");
			return map;
		}
		int len = valueStrArray.length > keyStrArray.length ? keyStrArray.length : valueStrArray.length;
		for (int i = 0; i < len; i++)
		{
			final String key = keyStrArray[i];
			final String value = valueStrArray[i];
			if (key == null)
			{
				continue;
			}
			if (value != null)
			{
				map.put(key, value);
			} else
			{
				map.remove(key);
			}
		}
		return map;
	}



	/**
	 * 检查map是否存在某个key
	 * @param map
	 * @param keyFields 可以为以","连接的多个key
	 * @return
	 */
	public static boolean containsKey(Map<?,?> map, String keyFields)
	{
		String[] keyFieldsA = keyFields.split(",");
		for (String key : keyFieldsA)
		{
			if (map.containsKey(key))
			{
				return true;
			}
		}
		return false;
	}

	/**
	 * 根据 map 数组中特定的键的值进行分组<br>
	 * <strong>泛型实现</strong>
	 * @author 杨斌
	 * @param arr
	 * @param key
	 * @return
	 */
	public static <K,V> Map<V,List<Map<K,V>>> groupG(Map<K,V>[] arr, Object key)
	{
		if (null == arr)
		{
			return null;
		}
		Map<V,List<Map<K,V>>> result = new HashMap<>();
		for (Map<K,V> map : arr)
		{
			V value = map.get(key);
			List<Map<K,V>> list = result.get(value);
			if (null == list)
			{
				result.put(value, list = new ArrayList<>());
			}
			list.add(map);
		}
		return result;
	}


	/**
	 * 根据 map 数组中特定的键的值进行分组<br>
	 * 在 map 数组中，key对应的值是唯一的。<br>
	 * <strong>泛型实现</strong>
	 * @author 杨斌
	 * @param arr
	 * @param key
	 * @return
	 */
	public static <K,V> Map<V,Map<K,V>> groupGByUniqueKey(Map<K,V>[] arr, Object key)
	{
		if (null == arr)
		{
			return null;
		}
		Map<V,Map<K,V>> result = new HashMap<>();
		for (Map<K,V> map : arr)
		{
			V value = map.get(key);
			if (result.containsKey(value))
			{
				throw new RuntimeException("Map 数组中“" + key + "”对应的值不唯一。");
			}
			result.put(value, map);
		}
		return result;
	}
}
