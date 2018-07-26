package com.nauticapp;
import android.content.Intent; 
import android.app.Application;
import com.facebook.FacebookSdk;
import com.facebook.CallbackManager;
import com.facebook.appevents.AppEventsLogger;
import com.facebook.react.ReactApplication;
import co.apptailor.googlesignin.RNGoogleSigninPackage;
import com.RNFetchBlob.RNFetchBlobPackage;
import com.facebook.FacebookSdk;
import com.facebook.reactnative.androidsdk.FBSDKPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.airbnb.android.react.maps.MapsPackage;
import com.devfd.RNGeocoder.RNGeocoderPackage;
import java.util.Arrays;
import java.util.List;
import co.apptailor.googlesignin.RNGoogleSigninPackage;  // <--- import

public class MainApplication extends Application implements ReactApplication {

  private static CallbackManager mCallbackManager = CallbackManager.Factory.create();
  protected static CallbackManager getCallbackManager() {
    return mCallbackManager;
  }

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
          new RNGoogleSigninPackage(),
          new RNFetchBlobPackage(),
          new FBSDKPackage(mCallbackManager),
          new MapsPackage(),
          new RNGeocoderPackage()
          
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }

  
  
  };


  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }




  @Override
  public void onCreate() {
    FacebookSdk.sdkInitialize(getApplicationContext());
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
  
    AppEventsLogger.activateApp(this);
  }


}
