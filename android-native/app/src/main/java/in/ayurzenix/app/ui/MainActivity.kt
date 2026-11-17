package in.ayurzenix.app.ui

import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import androidx.navigation.NavController
import androidx.navigation.findNavController
import androidx.navigation.ui.setupWithNavController
import com.google.android.material.bottomnavigation.BottomNavigationView
import com.google.firebase.auth.FirebaseAuth
import in.ayurzenix.app.R
import in.ayurzenix.app.databinding.ActivityMainBinding

class MainActivity : AppCompatActivity() {

    private lateinit var binding: ActivityMainBinding
    private lateinit var navController: NavController

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)

        val navView: BottomNavigationView = binding.navView
        navController = findNavController(R.id.nav_host_fragment_activity_main)
        navView.setupWithNavController(navController)
        
        // Disable tinting to show original 3D colorful icons
        navView.itemIconTintList = null

        navView.setOnItemSelectedListener { item ->
            val view = navView.findViewById<View>(item.itemId)
            view.animate()
                .scaleX(1.2f)
                .scaleY(1.2f)
                .setDuration(150)
                .withEndAction {
                    view.animate()
                        .scaleX(1.0f)
                        .scaleY(1.0f)
                        .setDuration(150)
                        .start()
                }
                .start()
            
            // Standard navigation behavior
            androidx.navigation.ui.NavigationUI.onNavDestinationSelected(item, navController)
            true
        }

        // Check auth state
        if (FirebaseAuth.getInstance().currentUser == null) {
            navController.navigate(R.id.navigation_login)
        }
    }
}
