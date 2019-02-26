package library.utility;

/**
 * Created by jeffy on 2017/6/7.
 */

import javax.servlet.ServletRequest;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.zip.GZIPOutputStream;

public class GzipUtilities {
    /** Check if the client support gzip */
    public static boolean isGzipSupported (ServletRequest request) {
        String encodings = ((HttpServletRequest)request).getHeader("Accept-Encoding");
//        System.out.println("Accept-Encoding: " + encodings);
        return((encodings != null) && (encodings.indexOf("gzip") != -1));
    }

    /** User can add parameter EnableGzip=true to enable using gzip response */
    public static boolean isGzipEnabled (ServletRequest request) {
        String flag = request.getParameter("enableGzip");
//        System.out.println("EnableGzip: " + flag);
        return((flag != null) && flag.equalsIgnoreCase("true"));
    }

    public static boolean canUsingGzip(ServletRequest request) {
        return isGzipSupported(request) && isGzipEnabled(request);
    }

    /** Return gzip PrintWriter for response. */
    public static PrintWriter getGzipWriter (HttpServletResponse response) throws IOException {
        return(new PrintWriter(new GZIPOutputStream(response.getOutputStream())));
    }

    public static void showNativeEncoding() {
        System.out.println();
        System.out.println("file.encoding: " + System.getProperty("file.encoding"));
        System.out.println("sun.jnu.encoding=" + System.getProperty("sun.jnu.encoding"));
        System.out.println("sun.io.unicode.encoding=" + System.getProperty("sun.io.unicode.encoding"));
        System.out.println("file.encoding.pkg=" + System.getProperty("file.encoding.pkg"));
        System.out.println();
    }

    public static void main(String... args) {
        showNativeEncoding();
    }
}
