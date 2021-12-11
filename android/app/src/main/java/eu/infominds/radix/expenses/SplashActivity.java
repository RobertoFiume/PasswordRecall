package eu.infominds.radix.expenses;

import android.content.Intent;
import android.os.Bundle;

import androidx.appcompat.app.AppCompatActivity;

public class SplashActivity extends AppCompatActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        Intent intent = new Intent(this, eu.infominds.radix.expenses.MainActivity.class);
        startActivity(intent);
        finish();
    }
}