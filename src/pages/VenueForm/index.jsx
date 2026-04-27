import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import "../../styles/index.scss"
import { createVenue } from "../../api/venues/createVenue.mjs"
import { updateVenue } from "../../api/venues/updateVenue.mjs"
import { deleteVenue } from "../../api/venues/deleteVenue.mjs"
import { getVenueById } from "../../api/venues/getVenueById.mjs"
import { loadStorage } from "../../utils/loadStorage.mjs"
import LoadingSpinner from "../../components/LoadingSpinner"
import Alert from "../../components/Alert"

const EMPTY_MEDIA = { url: "", alt: "" }

const DEFAULT_FORM = {
  name: "",
  description: "",
  price: "",
  maxGuests: "",
  address: "",
  zip: "",
  city: "",
  country: "",
  wifi: false,
  parking: false,
  breakfast: false,
  pets: false,
}

function VenueForm() {
  const { id } = useParams()
  const isEditMode = Boolean(id)
  const navigate = useNavigate()

  const [form, setForm] = useState(DEFAULT_FORM)
  const [mediaItems, setMediaItems] = useState([{ ...EMPTY_MEDIA }])
  const [loading, setLoading] = useState(isEditMode)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)

  const storedProfile = loadStorage("profile")

  useEffect(() => {
    if (!storedProfile) {
      navigate("/authenticate")
      return
    }

    if (!isEditMode) return

    getVenueById(id)
      .then(({ data }) => {
        const v = data
        setForm({
          name: v.name ?? "",
          description: v.description ?? "",
          price: v.price ?? "",
          maxGuests: v.maxGuests ?? "",
          address: v.location?.address ?? "",
          zip: v.location?.zip ?? "",
          city: v.location?.city ?? "",
          country: v.location?.country ?? "",
          wifi: v.meta?.wifi ?? false,
          parking: v.meta?.parking ?? false,
          breakfast: v.meta?.breakfast ?? false,
          pets: v.meta?.pets ?? false,
        })
        setMediaItems(
          v.media?.length
            ? v.media.map((m) => ({ url: m.url, alt: m.alt ?? "" }))
            : [{ ...EMPTY_MEDIA }],
        )
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const toggleAmenity = (key) => {
    setForm((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const handleMediaChange = (index, field, value) => {
    setMediaItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item)),
    )
  }

  const addMedia = () => setMediaItems((prev) => [...prev, { ...EMPTY_MEDIA }])

  const removeMedia = (index) => {
    setMediaItems((prev) => prev.filter((_, i) => i !== index))
  }

  const buildPayload = () => {
    const validMedia = mediaItems.filter((m) => m.url.trim())

    return {
      name: form.name.trim(),
      description: form.description.trim(),
      price: Number(form.price),
      maxGuests: Number(form.maxGuests),
      media: validMedia.map((m) => ({ url: m.url.trim(), alt: m.alt.trim() })),
      meta: {
        wifi: form.wifi,
        parking: form.parking,
        breakfast: form.breakfast,
        pets: form.pets,
      },
      location: {
        address: form.address.trim() || null,
        zip: form.zip.trim() || null,
        city: form.city.trim() || null,
        country: form.country.trim() || null,
      },
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    if (!form.name.trim()) return setError("Title is required.")
    if (!form.description.trim()) return setError("Description is required.")
    if (!form.price || isNaN(Number(form.price)))
      return setError("A valid price is required.")
    if (!form.maxGuests || isNaN(Number(form.maxGuests)))
      return setError("Max guests is required.")

    setSaving(true)
    try {
      const payload = buildPayload()
      if (isEditMode) {
        await updateVenue(id, payload)
        setSuccessMessage("Venue updated successfully!")
      } else {
        await createVenue(payload)
        setSuccessMessage("Venue created successfully!")
      }
      setTimeout(() => navigate("/venues/my"), 2000)
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (
      !window.confirm(
        "Are you sure you want to delete this venue? This cannot be undone.",
      )
    )
      return
    setDeleting(true)
    try {
      await deleteVenue(id)
      navigate("/venues/my")
    } catch (err) {
      setError(err.message)
      setDeleting(false)
    }
  }

  if (loading) return <LoadingSpinner />

  const amenities = [
    { key: "wifi", label: "WiFi", icon: "📶" },
    { key: "parking", label: "Parking", icon: "🅿" },
    { key: "breakfast", label: "Breakfast", icon: "☕" },
    { key: "pets", label: "Pets allowed", icon: "🐾" },
  ]

  return (
    <div className="venue-form-page">
      <div className="venue-form-card">
        <h1 className="venue-form-card__title">
          {isEditMode ? "Update Venue" : "Create Venue"}
        </h1>

        <form onSubmit={handleSubmit} noValidate>
          {/* Name */}
          <input
            className="venue-form-card__input"
            type="text"
            name="name"
            placeholder="Title"
            value={form.name}
            onChange={handleChange}
          />

          {/* Description */}
          <label className="venue-form-card__label">Descrition</label>
          <textarea
            className="venue-form-card__textarea"
            name="description"
            rows={4}
            value={form.description}
            onChange={handleChange}
          />

          {/* Price */}
          <input
            className="venue-form-card__input"
            type="number"
            name="price"
            placeholder="Price"
            min="0"
            value={form.price}
            onChange={handleChange}
          />

          {/* Max guests */}
          <input
            className="venue-form-card__input"
            type="number"
            name="maxGuests"
            placeholder="Max guests"
            min="1"
            value={form.maxGuests}
            onChange={handleChange}
          />

          {/* Location */}
          <input
            className="venue-form-card__input"
            type="text"
            name="address"
            placeholder="Address"
            value={form.address}
            onChange={handleChange}
          />
          <input
            className="venue-form-card__input"
            type="text"
            name="zip"
            placeholder="Zip code"
            value={form.zip}
            onChange={handleChange}
          />
          <input
            className="venue-form-card__input"
            type="text"
            name="city"
            placeholder="City"
            value={form.city}
            onChange={handleChange}
          />
          <input
            className="venue-form-card__input"
            type="text"
            name="country"
            placeholder="Country"
            value={form.country}
            onChange={handleChange}
          />

          {/* Amenities */}
          <p className="venue-form-card__label">Amenities</p>
          <div className="venue-form-card__amenities">
            {amenities.map(({ key, label, icon }) => (
              <button
                key={key}
                type="button"
                onClick={() => toggleAmenity(key)}
                className={`venue-form-card__amenity-chip${form[key] ? " venue-form-card__amenity-chip--active" : ""}`}
              >
                <span aria-hidden="true">{icon}</span> {label}
              </button>
            ))}
          </div>

          {/* Media */}
          {mediaItems.map((item, index) => (
            <div key={index} className="venue-form-card__media-group">
              <input
                className="venue-form-card__input"
                type="url"
                placeholder="Media URL"
                value={item.url}
                onChange={(e) =>
                  handleMediaChange(index, "url", e.target.value)
                }
              />
              <input
                className="venue-form-card__input"
                type="text"
                placeholder="Picture description (optional)"
                value={item.alt}
                onChange={(e) =>
                  handleMediaChange(index, "alt", e.target.value)
                }
              />
              {mediaItems.length > 1 && (
                <button
                  type="button"
                  className="venue-form-card__btn venue-form-card__btn--remove"
                  onClick={() => removeMedia(index)}
                >
                  Remove
                </button>
              )}
            </div>
          ))}

          <button
            type="button"
            className="venue-form-card__btn venue-form-card__btn--add-media"
            onClick={addMedia}
          >
            Add Media
          </button>

          {error && <Alert type="error" message={error} />}
          {successMessage && <Alert type="success" message={successMessage} />}

          <button
            type="submit"
            className="venue-form-card__btn venue-form-card__btn--submit"
            disabled={saving}
          >
            {saving ? "Saving…" : isEditMode ? "Update" : "Create"}
          </button>

          {isEditMode && (
            <button
              type="button"
              className="venue-form-card__btn venue-form-card__btn--delete"
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting ? "Deleting…" : "Delete"}
            </button>
          )}

          <button
            type="button"
            className="venue-form-card__btn venue-form-card__btn--cancel"
            onClick={() => navigate("/account")}
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  )
}

export default VenueForm
