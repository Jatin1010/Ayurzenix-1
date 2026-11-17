package in.ayurzenix.app.ui

import android.graphics.Color
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Toast
import androidx.fragment.app.Fragment
import androidx.fragment.app.viewModels
import androidx.navigation.fragment.findNavController
import com.github.mikephil.charting.data.*
import com.github.mikephil.charting.formatter.IndexAxisValueFormatter
import com.google.firebase.auth.FirebaseAuth
import in.ayurzenix.app.databinding.FragmentAdminDashboardBinding
import in.ayurzenix.app.viewmodel.AdminViewModel

class AdminDashboardFragment : Fragment() {

    private var _binding: FragmentAdminDashboardBinding? = null
    private val binding get() = _binding!!
    private val viewModel: AdminViewModel by viewModels()
    private val auth = FirebaseAuth.getInstance()

    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?): View {
        _binding = FragmentAdminDashboardBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        if (!isAdmin()) {
            Toast.makeText(requireContext(), "Access Denied: Admin Only", Toast.LENGTH_SHORT).show()
            findNavController().popBackStack()
            return
        }

        setupCharts()
        observeViewModel()
        setupControls()
    }

    private fun isAdmin(): Boolean {
        val email = auth.currentUser?.email?.lowercase() ?: return false
        val adminEmails = listOf("help@ayurzenix.in", "jatin1978kumar@gmail.com")
        return adminEmails.contains(email)
    }

    private fun observeViewModel() {
        viewModel.stats.observe(viewLifecycleOwner) { stats ->
            binding.tvTotalUsers.text = stats["total_users"]?.toString() ?: "0"
            binding.tvTotalRevenue.text = "₹${stats["total_revenue"]?.toString() ?: "0"}"
            binding.tvTotalScans.text = stats["total_scans"]?.toString() ?: "0"
            binding.tvConversionRate.text = "${stats["conversion_rate"]?.toString() ?: "0"}%"
            
            updateCharts(stats)
        }

        viewModel.config.observe(viewLifecycleOwner) { config ->
            val features = config["features"] as? Map<String, Any>
            val bodyScanConfig = features?.get("body_scan") as? Map<String, Any>
            binding.switchBodyScan.isChecked = bodyScanConfig?.get("enabled") as? Boolean ?: true

            val pricing = config["pricing"] as? Map<String, Any>
            binding.etPremiumPrice.setText(pricing?.get("premium_subscription")?.toString() ?: "499")
        }
    }

    private fun setupControls() {
        binding.switchBodyScan.setOnCheckedChangeListener { _, isChecked ->
            viewModel.updateFeatureStatus("body_scan", isChecked)
        }

        binding.btnUpdatePrice.setOnClickListener {
            val price = binding.etPremiumPrice.text.toString().toIntOrNull()
            if (price != null) {
                viewModel.updatePremiumPrice(price)
                Toast.makeText(requireContext(), "Price updated successfully", Toast.LENGTH_SHORT).show()
            }
        }

        binding.btnSendBroadcast.setOnClickListener {
            val message = binding.etBroadcastMessage.text.toString()
            if (message.isNotEmpty()) {
                viewModel.sendBroadcastMessage(message)
                binding.etBroadcastMessage.setText("")
                Toast.makeText(requireContext(), "Broadcast sent successfully", Toast.LENGTH_SHORT).show()
            }
        }
    }

    private fun setupCharts() {
        // Revenue Chart Styling
        binding.revenueChart.apply {
            description.isEnabled = false
            setTouchEnabled(true)
            setPinchZoom(true)
            xAxis.textColor = Color.WHITE
            axisLeft.textColor = Color.WHITE
            axisRight.isEnabled = false
            legend.textColor = Color.WHITE
        }

        // Feature Chart Styling
        binding.featureChart.apply {
            description.isEnabled = false
            xAxis.textColor = Color.WHITE
            axisLeft.textColor = Color.WHITE
            axisRight.isEnabled = false
            legend.textColor = Color.WHITE
        }
    }

    private fun updateCharts(stats: Map<String, Any>) {
        // Dummy data for demo if Firestore is empty
        val dailyRevenue = stats["daily_revenue"] as? Map<String, Any> ?: mapOf(
            "Mon" to 1200, "Tue" to 1500, "Wed" to 1100, "Thu" to 1800, "Fri" to 2200, "Sat" to 2500, "Sun" to 2100
        )

        val revenueEntries = dailyRevenue.entries.mapIndexed { index, entry ->
            Entry(index.toFloat(), (entry.value as? Number)?.toFloat() ?: 0f)
        }

        val revenueDataSet = LineDataSet(revenueEntries, "Daily Revenue (₹)").apply {
            color = Color.parseColor("#10B981")
            setCircleColor(Color.WHITE)
            lineWidth = 2f
            circleRadius = 4f
            setDrawCircleHole(false)
            valueTextColor = Color.WHITE
            setDrawFilled(true)
            fillColor = Color.parseColor("#10B981")
            fillAlpha = 50
        }

        binding.revenueChart.data = LineData(revenueDataSet)
        binding.revenueChart.xAxis.valueFormatter = IndexAxisValueFormatter(dailyRevenue.keys.toList())
        binding.revenueChart.invalidate()

        // Feature Usage Chart
        val featureUsage = stats["feature_usage"] as? Map<String, Any> ?: mapOf(
            "Health Scan" to 450, "Body Scan" to 320, "Face Glow" to 280, "Routine" to 560
        )

        val featureEntries = featureUsage.entries.mapIndexed { index, entry ->
            BarEntry(index.toFloat(), (entry.value as? Number)?.toFloat() ?: 0f)
        }

        val featureDataSet = BarDataSet(featureEntries, "Usage Count").apply {
            color = Color.parseColor("#6366F1")
            valueTextColor = Color.WHITE
        }

        binding.featureChart.data = BarData(featureDataSet)
        binding.featureChart.xAxis.valueFormatter = IndexAxisValueFormatter(featureUsage.keys.toList())
        binding.featureChart.invalidate()
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}
