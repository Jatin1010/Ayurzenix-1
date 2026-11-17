package in.ayurzenix.app.ui

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import androidx.navigation.fragment.findNavController
import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.firestore.FirebaseFirestore
import in.ayurzenix.app.R
import in.ayurzenix.app.databinding.FragmentProfileBinding

class ProfileFragment : Fragment() {

    private var _binding: FragmentProfileBinding? = null
    private val binding get() = _binding!!
    private val auth = FirebaseAuth.getInstance()
    private val db = FirebaseFirestore.getInstance()

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        _binding = FragmentProfileBinding.inflate(inflater, container, false)
        
        setupUI()
        checkAdminStatus()
        
        return binding.root
    }

    private fun setupUI() {
        val user = auth.currentUser
        if (user != null) {
            binding.tvUserEmail.text = user.email
            
            // Fetch name from Firestore
            db.collection("users").document(user.uid).get()
                .addOnSuccessListener { document ->
                    if (document != null && document.exists()) {
                        binding.tvUserName.text = document.getString("name") ?: "User"
                    }
                }
        }

        binding.btnAdminPanel.setOnClickListener {
            findNavController().navigate(R.id.navigation_admin_dashboard)
        }

        binding.btnHistory.setOnClickListener {
            findNavController().navigate(R.id.navigation_history)
        }

        binding.btnWallet.setOnClickListener {
            findNavController().navigate(R.id.navigation_wallet)
        }

        binding.btnLogout.setOnClickListener {
            auth.signOut()
            findNavController().navigate(R.id.navigation_login)
        }
    }

    private fun checkAdminStatus() {
        val user = auth.currentUser
        if (user == null) {
            binding.btnAdminPanel.visibility = View.GONE
            return
        }

        val email = user.email?.lowercase() ?: ""
        val adminEmails = listOf("help@ayurzenix.in", "jatin1978kumar@gmail.com")

        if (adminEmails.contains(email)) {
            binding.btnAdminPanel.visibility = View.VISIBLE
        } else {
            binding.btnAdminPanel.visibility = View.GONE
        }
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}
