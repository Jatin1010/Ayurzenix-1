package in.ayurzenix.app.ui

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import androidx.fragment.app.viewModels
import androidx.core.widget.addTextChangedListener
import com.google.android.material.dialog.MaterialAlertDialogBuilder
import in.ayurzenix.app.adapter.HistoryAdapter
import in.ayurzenix.app.databinding.FragmentHistoryBinding
import in.ayurzenix.app.model.HealthResult
import in.ayurzenix.app.viewmodel.HistoryViewModel

class HistoryFragment : Fragment() {

    private var _binding: FragmentHistoryBinding? = null
    private val binding get() = _binding!!
    private val viewModel: HistoryViewModel by viewModels()
    private lateinit var adapter: HistoryAdapter
    private var allResults: List<HealthResult> = emptyList()

    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?): View {
        _binding = FragmentHistoryBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        adapter = HistoryAdapter(
            onItemClick = { result ->
                showResultDetail(result)
            },
            onItemLongClick = { result ->
                showDeleteConfirmation(result)
            }
        )

        binding.rvHistory.adapter = adapter

        viewModel.allResults.observe(viewLifecycleOwner) { results ->
            allResults = results
            filterResults(binding.etSearch.text.toString())
        }

        binding.etSearch.addTextChangedListener { text ->
            filterResults(text.toString())
        }
    }

    private fun filterResults(query: String) {
        val filteredList = if (query.isEmpty()) {
            allResults
        } else {
            allResults.filter { 
                it.conditionName.contains(query, ignoreCase = true) || 
                it.symptoms.contains(query, ignoreCase = true) ||
                it.featureType.contains(query, ignoreCase = true)
            }
        }
        adapter.submitList(filteredList)
        binding.layoutEmpty.visibility = if (filteredList.isEmpty()) View.VISIBLE else View.GONE
    }

    private fun showResultDetail(result: HealthResult) {
        MaterialAlertDialogBuilder(requireContext())
            .setTitle(result.conditionName)
            .setMessage("Feature: ${result.featureType}\n\nSymptoms: ${result.symptoms}\n\nResult:\n${result.fullResult}")
            .setPositiveButton("Close", null)
            .show()
    }

    private fun showDeleteConfirmation(result: HealthResult) {
        MaterialAlertDialogBuilder(requireContext())
            .setTitle("Delete History")
            .setMessage("Are you sure you want to delete this record?")
            .setNegativeButton("Cancel", null)
            .setPositiveButton("Delete") { _, _ ->
                viewModel.deleteResult(result)
            }
            .show()
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}
