package in.ayurzenix.app.adapter

import android.content.Intent
import android.net.Uri
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import android.widget.ImageView
import android.widget.LinearLayout
import android.widget.TextView
import androidx.cardview.widget.CardView
import androidx.recyclerview.widget.RecyclerView
import in.ayurzenix.app.R
import in.ayurzenix.app.model.ChatMessage
import in.ayurzenix.app.model.MessageStatus
import io.noties.markwon.Markwon
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

class ChatAdapter(
    private val messages: List<ChatMessage>,
    private val onRetry: (ChatMessage) -> Unit = {}
) : RecyclerView.Adapter<ChatAdapter.ChatViewHolder>() {

    class ChatViewHolder(view: View) : RecyclerView.ViewHolder(view) {
        val tvMessage: TextView? = view.findViewById(R.id.tvMessage)
        val tvTimestamp: TextView? = view.findViewById(R.id.tvTimestamp)
        val ivStatus: ImageView? = view.findViewById(R.id.ivStatus)
        val ivMessageImage: ImageView? = view.findViewById(R.id.ivMessageImage)
        val cardImage: CardView? = view.findViewById(R.id.cardImage)
        val btnRetry: Button? = view.findViewById(R.id.btnRetry)
        
        // Analysis Result Views
        val tvObservation: TextView? = view.findViewById(R.id.tvObservation)
        val tvImbalance: TextView? = view.findViewById(R.id.tvImbalance)
        val tvWellness: TextView? = view.findViewById(R.id.tvWellness)
        val tvRemedies: TextView? = view.findViewById(R.id.tvRemedies)
        val layoutMedicines: LinearLayout? = view.findViewById(R.id.layoutMedicines)
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ChatViewHolder {
        val layout = when (viewType) {
            1 -> R.layout.item_chat_user
            2 -> R.layout.item_analysis_result
            else -> R.layout.item_chat_ai
        }
        val view = LayoutInflater.from(parent.context).inflate(layout, parent, false)
        return ChatViewHolder(view)
    }

    override fun onBindViewHolder(holder: ChatViewHolder, position: Int) {
        val message = messages[position]
        
        if (message.isAnalysisResult && message.analysisData != null) {
            val data = message.analysisData
            holder.tvObservation?.text = "Observation: ${data.observation}"
            holder.tvImbalance?.text = "Imbalance: ${data.imbalance}"
            holder.tvWellness?.text = "Wellness Insight: ${data.wellnessInsight}"
            holder.tvRemedies?.text = data.remedies.joinToString("\n") { "• $it" }
            
            holder.layoutMedicines?.removeAllViews()
            data.medicines.forEach { med ->
                val medView = LayoutInflater.from(holder.itemView.context).inflate(R.layout.item_medicine_card, holder.layoutMedicines, false)
                medView.findViewById<TextView>(R.id.tvMedName).text = med.name
                medView.findViewById<TextView>(R.id.tvMedBenefit).text = med.benefit
                medView.findViewById<TextView>(R.id.tvMedTag).text = if (data.medicines.indexOf(med) % 2 == 0) "Recommended for you" else "Popular Ayurvedic choice"
                medView.findViewById<TextView>(R.id.tvPrice).text = med.price ?: "₹299"
                medView.findViewById<TextView>(R.id.tvMrp).text = "MRP ${med.mrp ?: "₹499"}"
                medView.findViewById<TextView>(R.id.tvReviewCount).text = "(${med.reviewCount} reviews)"
                
                val stars = StringBuilder()
                val fullStars = med.rating.toInt()
                for (i in 1..5) {
                    if (i <= fullStars) stars.append("★") else stars.append("☆")
                }
                medView.findViewById<TextView>(R.id.tvRatingStars).text = stars.toString()

                val ivMedImage = medView.findViewById<ImageView>(R.id.ivMedImage)
                com.bumptech.glide.Glide.with(holder.itemView.context)
                    .load(med.imageUrl ?: "https://picsum.photos/seed/${med.name}/200/200")
                    .placeholder(R.drawable.ic_leaf)
                    .into(ivMedImage)

                medView.findViewById<Button>(R.id.btnBuy).setOnClickListener {
                    val medicineName = med.name.replace(" ", "+")
                    val amazonUrl = if (med.amazonLink.contains("amazon.in")) {
                        if (med.amazonLink.contains("tag=")) med.amazonLink else "${med.amazonLink}&tag=goldify00-21"
                    } else {
                        "https://www.amazon.in/s?k=$medicineName&tag=goldify00-21"
                    }
                    val intent = Intent(Intent.ACTION_VIEW, Uri.parse(amazonUrl))
                    holder.itemView.context.startActivity(intent)
                }
                holder.layoutMedicines?.addView(medView)
            }
        } else {
            val markwon = Markwon.create(holder.itemView.context)
            holder.tvMessage?.let { markwon.setMarkdown(it, message.text) }

            if (message.isUser && message.image != null) {
                holder.cardImage?.visibility = View.VISIBLE
                holder.ivMessageImage?.setImageBitmap(message.image)
            } else {
                holder.cardImage?.visibility = View.GONE
            }

            if (message.isError && message.errorImage != null) {
                holder.btnRetry?.visibility = View.VISIBLE
                holder.btnRetry?.setOnClickListener {
                    onRetry(message)
                }
            } else {
                holder.btnRetry?.visibility = View.GONE
            }

            // Bind timestamp
            val sdf = SimpleDateFormat("hh:mm a", Locale.getDefault())
            holder.tvTimestamp?.text = sdf.format(Date(message.timestamp))

            // Bind status for user messages
            if (message.isUser) {
                val statusIcon = when (message.status) {
                    MessageStatus.SENT -> R.drawable.ic_leaf // Placeholder for sent
                    MessageStatus.DELIVERED -> R.drawable.ic_leaf // Placeholder for delivered
                    MessageStatus.READ -> R.drawable.ic_leaf // Placeholder for read
                }
                holder.ivStatus?.setImageResource(statusIcon)
                
                // Color coding status
                val statusColor = when (message.status) {
                    MessageStatus.SENT -> "#E2E8F0"
                    MessageStatus.DELIVERED -> "#CBD5E1"
                    MessageStatus.READ -> "#FFFFFF"
                }
                holder.ivStatus?.imageTintList = android.content.res.ColorStateList.valueOf(android.graphics.Color.parseColor(statusColor))
            }
        }
    }

    override fun getItemCount() = messages.size

    override fun getItemViewType(position: Int): Int {
        return when {
            messages[position].isUser -> 1
            messages[position].isAnalysisResult -> 2
            else -> 0
        }
    }
}
