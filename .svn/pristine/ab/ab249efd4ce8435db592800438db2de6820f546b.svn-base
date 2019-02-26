package library.encode;

import java.io.IOException;

/**
 * Created by FoneBote on 2017/3/13.
 */
public class DoEncode {

    public static void main(String[] args) throws IOException, Exception {
        // TODO Auto-generated method stub
        EncodeUtilImpl e=new EncodeUtilImpl();
        try {
            e.encode("orig.properties", "encode.txt");
            e.decode("encode.txt", "decode.txt");
        } catch (Exception e1) {
            e1.printStackTrace();
        }
    }
}
