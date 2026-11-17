package in.ayurzenix.app.adapter

import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.recyclerview.widget.DiffUtil
import androidx.recyclerview.widget.ListAdapter
import androidx.recyclerview.widget.RecyclerView
import in.ayurzenix.app.databinding.ItemHistoryBinding
import in.ayurzenix.app.model.HealthResult
import java.text.SimpleDateFormat
import java.util.*

class HistoryAdapter(
    private val onItemClick: (HealthResult) -> Unit,
    private val onItemLongClick: (HealthResult) -> Unit
) : ListAdapter<HealthResult, HistoryAdapter.HistoryViewHolder>(DiffCallback()) {

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): HistoryViewHolder {
        val binding = ItemHistoryBinding.inflate(LayoutInflater.from(parent.context), parent, false)
        return HistoryViewHolder(binding)
    }

    override fun onBindViewHolder(holder: HistoryViewHolder, position: Int) {
        holder.bind(getItem(position))
    }

    inner class HistoryViewHolder(private val binding: ItemHistoryBinding) : RecyclerView.ViewHolder(binding.root) {
        fun bind(result: HealthResult) {
            binding.tvConditionName.text = result.conditionName
            binding.tvSymptoms.text = "Symptoms: ${result.symptoms}"
            binding.tvFeatureType.text = result.featureType
            
            val sdf = SimpleDateFormat("dd MMM", Locale.getDefault())
            binding.tvDate.text = sdf.format(Date(result.date))

            binding.root.setOnClickListener { onItemClick(result) }
            binding.root.setOnLongClickListener {
                onItemLongClick(result)
                true
            }
        }
    }

    class DiffCallback : DiffUtil.ItemCallback<HealthResult>() {
        override fun areItemsTheSame(oldItem: HealthResult, newItem: HealthResult) = oldItem.id == newItem.id
        override fun areContentsTheSame(oldItem: HealthResult, newItem: HealthResult) = oldItem == newItem
    }
}
