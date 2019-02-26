package library.utility;

import abstracts.ServletAdapter;
import com.google.gson.JsonObject;
import com.google.gson.JsonSyntaxException;
import model.PadLogonRec;

import javax.servlet.ServletRequest;
import javax.servlet.http.HttpServletRequest;
import java.io.File;
import java.io.IOException;
import java.lang.reflect.Method;
import java.lang.reflect.Parameter;
import java.net.URL;
import java.sql.Connection;
import java.sql.SQLException;
import java.time.LocalDateTime;
import java.util.*;

/**
 * Created by jeffy on 2017/8/2.
 */
public class ServicesUtil {
    ServicesUtil() {

    }

    private static Class[] getClasses(String packageName) throws ClassNotFoundException, IOException {
        ClassLoader classLoader = Thread.currentThread().getContextClassLoader();
        assert classLoader != null;

        String path = packageName.replace('.', '/');
        Enumeration<URL> resources = classLoader.getResources(path);

        List<File> dirs = new ArrayList<>();
        while (resources.hasMoreElements()) {
            URL resource = resources.nextElement();
            dirs.add(new File(resource.getFile()));
        }

        ArrayList<Class> classes = new ArrayList<>();
        for (File directory : dirs) {
            classes.addAll(findClasses(directory, packageName));
        }

        return classes.toArray(new Class[classes.size()]);
    }

    private static List findClasses(File directory, String packageName) throws ClassNotFoundException {
        List classes = new ArrayList();

        if (!directory.exists()) {
            return classes;
        }

        File[] files = directory.listFiles();

        for (File file : files) {
            if (file.isDirectory()) {
                assert !file.getName().contains(".");
                classes.addAll(findClasses(file, packageName + "." + file.getName()));
            } else if (file.getName().endsWith(".class")) {
                classes.add(Class.forName(packageName + '.' + file.getName().substring(0, file.getName().length() - 6)));
            }
        }
        return classes;
    }

    public static List<String> getClassNames(String packageName) {
        List<String> classNames = new ArrayList<>();
        Class[] classes;
        try {
            classes = getClasses(packageName);
            for (Class c : classes) {
                classNames.add(c.getName());
            }
        } catch (ClassNotFoundException|IOException ex) {
            ex.printStackTrace();
        }

        return classNames;
    }

    public static List<String> getClassSimpleNames(String packageName) {
        List<String> classNames = new ArrayList<>();
        Class[] classes = new Class[0];

        try {
            classes = getClasses(packageName);
            for (Class c : classes) {
                classNames.add(c.getSimpleName());
            }
        } catch (ClassNotFoundException|IOException ex) {
            ex.printStackTrace();
        }

        return classNames;
    }

    public static Map<String, String> getRequestParameters(ServletRequest request) {
        Map<String, String> result = null;
        try {
            Enumeration parameterNames = request.getParameterNames();

            while(parameterNames.hasMoreElements()) {
                String current = (String) parameterNames.nextElement();
                String currentValue = (String) request.getParameter(current);
                result.put(current, currentValue);
            }
            return result;
        }
        catch (Exception ex) {
            return result;
        }
    }

    public static ServletAdapter getServletAdpater(String packageName, String serviceName) {
        ServletAdapter servletAdapter = null;
        try {
            servletAdapter = (ServletAdapter) Class.forName(packageName + "." + serviceName).newInstance();
        } catch (ClassNotFoundException | InstantiationException | IllegalAccessException ex) {
            ex.printStackTrace();
        }
        return servletAdapter;
    }

    public static boolean checkPadLogonRec(String idNo, long sessionID) {
        JDBCUtilities jdbcUtil = new JDBCUtilities();
        Connection myConnection = null;
        Map<String, Object> object;
        Boolean result = false;

        try {
            myConnection = jdbcUtil.getConnection();
            PadLogonRec padLogonRec = new PadLogonRec(myConnection);
            object = padLogonRec.countPadLogonRec(idNo, sessionID);

            if (object.get("status").equals("Success")) {
                object = padLogonRec.updatePadLogonRec(idNo, sessionID);
            }

            if (object.get("status").equals("Success")) {
                result = true;
            }

        } catch (SQLException ex) {
            JDBCUtilities.printSQLException(ex);
        } finally {
            if (myConnection != null) {
                JDBCUtilities.closeConnection(myConnection);
            }
        }
//        System.out.println("\n    --> CheckPadLogonRec Fianl Result = " + result);
        return result;
    }

    public static Map<String, List<String>> getMethodNames(Object obj) {
        Map<String, List<String>> result = new LinkedHashMap<>();
        Method[] methods = new Method[0];
        try {
            methods = obj.getClass().getDeclaredMethods();
        } catch (SecurityException ex) {
            ex.printStackTrace();
        }

        for (Method m : methods) {
            if (m.getName().equals("main") || m.getName().equals("run")) continue;

            Class<?>[] paramTypes = m.getParameterTypes();

            List<String> paramTypeNames = new ArrayList<>();
            for (Class<?> c : paramTypes) {
                paramTypeNames.add(c.getTypeName());
            }

            result.put(m.getName(), paramTypeNames);
        }

        return result;
    }

    public static Map<String, Object> checkRequestParameters(ServletRequest request) {
        Boolean checkSuccess = true;
        String errorMessage = "";
        Map<String, Object> checkResult = new LinkedHashMap<>();

        if (request instanceof HttpServletRequest) {
            String url = ((HttpServletRequest)request).getRequestURL().toString();
            System.out.println("\nTime: " + LocalDateTime.now() + "\n    -->url: " + url);
        }

        String serviceName = request.getParameter("serviceName");
        String parameters = request.getParameter("parameters");
        System.out.println("\nTime: " + LocalDateTime.now() + "\n    -->serviceName: " + serviceName);
        System.out.println("\nTime: " + LocalDateTime.now() + "\n    -->parameters: " + parameters);
        // Check service name not null
        if (checkSuccess) {
            if (serviceName == null) {
                checkSuccess = false;
                errorMessage = "Service Name is null, serviceName=" + serviceName;
            }
        }

        // Check service is available
        if (checkSuccess) {
            if (!ServicesUtil.getClassSimpleNames("service").contains(serviceName)) {
                checkSuccess = false;
                errorMessage = "Service is not availabe, serviceName=" + serviceName;
            }
        }

        // Check parameters not null
        if (checkSuccess) {
            if (parameters == null) {
                checkSuccess = false;
                errorMessage = "parameters is null, parameters=" + parameters;
            }
        }

        // Check parameters is a valid json string
        JsonObject parametersJsObj = new JsonObject();
        if (checkSuccess) {
            try {
                parametersJsObj = MapUtil.strToJsonObject(parameters);
            } catch (JsonSyntaxException ex) {
                checkSuccess = false;
                errorMessage = "Parameters is not a vaild json syntax, parameters=" + parameters;
            }
        }

        // Check empNo is not null
        String empNo = "";
        if (checkSuccess) {
            if (parametersJsObj.get("empNo") != null) {
                empNo = parametersJsObj.get("empNo").getAsString();
            } else {
                checkSuccess = false;
                errorMessage = "empNo is null, empNo=" + empNo;
            }
        }

        // Check sessionID is not null. !!! AuthService do not have sessionID !!!
        long sessionID = 0L;
        if (checkSuccess && !serviceName.equals("AuthService")) {
            if (parametersJsObj.get("sessionID") != null) {
                sessionID = parametersJsObj.get("sessionID").getAsLong();
            } else {
                checkSuccess = false;
                errorMessage = "sessionID is null, sessionID=" + sessionID;
            }
        }

        // Check method name is not null
        String methodName = "";
        if (checkSuccess) {
            if (parametersJsObj.get("method") != null) {
                methodName = parametersJsObj.get("method").getAsString();
            } else {
                checkSuccess = false;
                errorMessage = "Method name is null, methodName=" + methodName;
            }
        }

        // Initialize service class
        ServletAdapter servletAdapter = null;
        if (checkSuccess) {
            servletAdapter = ServicesUtil.getServletAdpater("service", serviceName);
            if (servletAdapter == null) {
                checkSuccess = false;
                errorMessage = "Service initialize failed, serviceName=" + serviceName;
            }
        }

        // check method available
        if (checkSuccess) {
            if (!ServicesUtil.getMethodNames(servletAdapter).containsKey(methodName)) {
                checkSuccess = false;
                errorMessage = "Method Name is not available, serviceName=" + serviceName + " methodName=" + methodName;
            }
        }

        if (checkSuccess) {
            checkResult.put("status", "Success");
            checkResult.put("serviceName", serviceName);
            checkResult.put("methodName", methodName);
            checkResult.put("parameters", parameters);
            checkResult.put("servletAdapter", servletAdapter);
            checkResult.put("parametersJsObj", parametersJsObj);
        } else {
            checkResult.put("status", "Failure");
            checkResult.put("errorMessage", errorMessage);
        }
        return checkResult;
    }

    public static void main(String[] args) {
        String packageName = "service";
        List<String> classesNames = getClassNames(packageName);
        System.out.println("Service ClassesNames : " + classesNames);
        List<String> classesSimpleNames = getClassSimpleNames("service");
        System.out.println("Service classesSimpleNames : " + classesSimpleNames);

        String serviceName = "PadLogonService";
        ServletAdapter servletAdapter = getServletAdpater(packageName, serviceName);
        Map<String, List<String>> methodArray = getMethodNames(servletAdapter);
        System.out.println(serviceName + " contains methods: " +  methodArray);


        Method[] methods = servletAdapter.getClass().getDeclaredMethods();

        for (Method m : methods) {
            System.out.println("Method Name: " + m.getName());
            for (Parameter p : m.getParameters()) {
                System.out.println("Parameter Name: " + p.getName());
                System.out.println("ParameterizedType Name: " + p.getParameterizedType().getTypeName());
            }
        }
    }
}
