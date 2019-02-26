package library.encode;

import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.util.Enumeration;
import java.util.Properties;

/**
 * Created by FoneBote on 2017/3/13.
 */
public class EncodeUtilImpl implements EncodeUtil {

    @Override
    public void encode(String fileInputName, String fileOutputName) throws Exception {
        fileInputName = DoEncode.class.getResource("/").toURI().getPath() + fileInputName;
        fileOutputName = DoEncode.class.getResource("/").toURI().getPath() + fileOutputName;
        FileInputStream in = new FileInputStream(fileInputName);
        FileOutputStream out = new FileOutputStream(fileOutputName);
        Properties prop = new Properties();
        prop.load(in);
        Enumeration<?> names = prop.propertyNames();

        while(names.hasMoreElements()){
            String name = (String)names.nextElement();
            String value = prop.getProperty(name);
            String result = "";
            for(char c:value.toCharArray()){
                c -= 10;
                result += c;
            }
            prop.setProperty(name, result);
        }

        prop.store(out, "");
        System.out.println("decode from :" + fileInputName + "to " + fileOutputName + "done");
    }

    @Override
    public void decode(String fileInputName, String fileOutputName) throws Exception {

        fileInputName = DoEncode.class.getResource("/").toURI().getPath() + fileInputName;
        fileOutputName = DoEncode.class.getResource("/").toURI().getPath() + fileOutputName;
        FileInputStream in = new FileInputStream(fileInputName);
        FileOutputStream out = new FileOutputStream(fileOutputName);
        Properties prop = new Properties();
        prop.load(in);
        Enumeration<?> names = prop.propertyNames();

        while(names.hasMoreElements()){
            String name = (String)names.nextElement();
            String value = prop.getProperty(name);
            String result = "";
            for(char c:value.toCharArray()){
                c += 10;
                result += c;
            }
            prop.setProperty(name, result);
        }

        prop.store(out, "");
        System.out.println("encode from :" + fileInputName + "to " + fileOutputName + "done");
    }

    @Override
    public String encodeOne(String inputStr) throws Exception {
        return null;
    }

    @Override
    public String decodeOne(String inputStr) throws Exception {
        return null;
    }
}
