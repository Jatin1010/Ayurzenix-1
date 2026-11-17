package in.ayurzenix.app.ui

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.view.animation.AnimationUtils
import androidx.fragment.app.Fragment
import androidx.lifecycle.ViewModelProvider
import androidx.navigation.fragment.findNavController
import com.bumptech.glide.Glide
import com.google.firebase.auth.FirebaseAuth
import in.ayurzenix.app.R
import in.ayurzenix.app.databinding.FragmentHomeBinding
import in.ayurzenix.app.viewmodel.HomeViewModel

class HomeFragment : Fragment() {

    private var _binding: FragmentHomeBinding? = null
    private val binding get() = _binding!!
    private lateinit var viewModel: HomeViewModel
    private val auth = FirebaseAuth.getInstance()

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        _binding = FragmentHomeBinding.inflate(inflater, container, false)
        viewModel = ViewModelProvider(this).get(HomeViewModel::class.java)

        setupUI()
        observeViewModel()

        val pulseAnim = AnimationUtils.loadAnimation(requireContext(), R.anim.pulse_anim)
        binding.ivPulseLine.startAnimation(pulseAnim)

        return binding.root
    }

    private fun setupUI() {
        // Load a high-quality Ayurvedic herb image into the hero section
        Glide.with(this)
            .load("https://images.unsplash.com/photo-1540331547168-8b63109225b7?auto=format&fit=crop&q=80&w=1000")
            .placeholder(R.drawable.bg_gradient_green)
            .into(binding.ivHero)

        binding.btnStartChat.setOnClickListener {
            findNavController().navigate(R.id.navigation_chat)
        }

        binding.cardHealthScan.setOnClickListener {
            findNavController().navigate(R.id.navigation_chat)
        }

        binding.cardBodyScan.setOnClickListener {
            findNavController().navigate(R.id.navigation_body_scan)
        }

        binding.cardAskAI.setOnClickListener {
            findNavController().navigate(R.id.navigation_chat)
        }

        binding.cardDailyRoutine.setOnClickListener {
            findNavController().navigate(R.id.navigation_daily_routine)
        }

        binding.btnStartRoutine.setOnClickListener {
            findNavController().navigate(R.id.navigation_daily_routine)
        }

        binding.cardHistory.setOnClickListener {
            findNavController().navigate(R.id.navigation_history)
        }

        binding.ivLogo.setOnLongClickListener {
            if (isAdmin()) {
                findNavController().navigate(R.id.navigation_admin_dashboard)
                true
            } else {
                false
            }
        }
    }

    private fun isAdmin(): Boolean {
        val email = auth.currentUser?.email?.lowercase() ?: return false
        val adminEmails = listOf("help@ayurzenix.in", "jatin1978kumar@gmail.com")
        return adminEmails.contains(email)
    }

    private fun observeViewModel() {
        viewModel.userName.observe(viewLifecycleOwner) { name ->
            binding.tvAppName.text = "Ayurzenix"
        }

        viewModel.walletBalance.observe(viewLifecycleOwner) { balance ->
            binding.tvBalance.text = "₹$balance"
        }

        viewModel.isBodyScanEnabled.observe(viewLifecycleOwner) { isEnabled ->
            binding.cardBodyScan.alpha = if (isEnabled) 1.0f else 0.5f
            binding.cardBodyScan.isEnabled = isEnabled
        }
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}
