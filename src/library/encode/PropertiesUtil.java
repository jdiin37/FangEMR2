package library.encode;

import jdk.internal.util.xml.impl.Input;

import java.io.IOException;
import java.io.InputStream;
import java.util.Properties;

public class PropertiesUtil {

    public static Properties loadProperties() {
        Properties properties = new Properties();
        InputStream is = getPropertiesIs();

        try {
            properties.load(is);
            is.close();
        } catch (IOException e) {
            e.printStackTrace();
        }

        return properties;
    }

    public static InputStream getPropertiesIs() {
        InputStream is = null;

        try {
            is = PropertiesUtil.class.getResourceAsStream("/conf/config.properties");
        } catch (Exception ex) {
            ex.printStackTrace();
        }

        return is;
    }
}
