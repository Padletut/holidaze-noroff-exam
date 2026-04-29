import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import "../../styles/index.scss"
import { createVenue } from "../../api/venues/createVenue.mjs"
import { updateVenue } from "../../api/venues/updateVenue.mjs"
import { deleteVenue } from "../../api/venues/deleteVenue.mjs"
import { getVenueById } from "../../api/venues/getVenueById.mjs"
import { loadStorage } from "../../utils/loadStorage.mjs"
import { buildVenuePayload } from "../../utils/buildVenuePayload.mjs"
import LoadingSpinner from "../../components/LoadingSpinner"
import Alert from "../../components/Alert"
import VenueMediaInputs from "./VenueMediaInputs"
import { EMPTY_MEDIA } from "./constants.mjs"
import VenueAmenities from "./VenueAmenities"
import VenueDeleteConfirm from "./VenueDeleteConfirm"

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
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
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

  const handleMediaChange = (index, field, value) => {
    setMediaItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item)),
    )
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
      const payload = buildVenuePayload(form, mediaItems)
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
    setDeleting(true)
    try {
      await deleteVenue(id)
      navigate("/venues/my")
    } catch (err) {
      setError(err.message)
      setDeleting(false)
      setShowDeleteConfirm(false)
    }
  }

  if (loading) return <LoadingSpinner />

  return (
    <div className="venue-form-page">
      <div className="venue-form-card">
        <h1 className="venue-form-card__title">
          {isEditMode ? "Update Venue" : "Create Venue"}
        </h1>

        <form onSubmit={handleSubmit} noValidate>
          <div className="venue-form-card__columns">
            {/* ── Left column ── */}
            <div className="venue-form-card__col">
              <div className="venue-form-card__field">
                <input
                  className="venue-form-card__input"
                  type="text"
                  id="name"
                  name="name"
                  placeholder=" "
                  value={form.name}
                  onChange={handleChange}
                />
                <label className="venue-form-card__label" htmlFor="name">
                  Title
                </label>
              </div>

              <div className="venue-form-card__field">
                <textarea
                  className="venue-form-card__textarea"
                  id="description"
                  name="description"
                  rows={4}
                  placeholder=" "
                  value={form.description}
                  onChange={handleChange}
                />
                <label className="venue-form-card__label" htmlFor="description">
                  Description
                </label>
              </div>

              <div className="venue-form-card__field">
                <input
                  className="venue-form-card__input"
                  type="number"
                  id="price"
                  name="price"
                  min="0"
                  placeholder=" "
                  value={form.price}
                  onChange={handleChange}
                />
                <label className="venue-form-card__label" htmlFor="price">
                  Price per night (NOK)
                </label>
              </div>

              <div className="venue-form-card__field">
                <input
                  className="venue-form-card__input"
                  type="number"
                  id="maxGuests"
                  name="maxGuests"
                  min="1"
                  placeholder=" "
                  value={form.maxGuests}
                  onChange={handleChange}
                />
                <label className="venue-form-card__label" htmlFor="maxGuests">
                  Max guests
                </label>
              </div>

              <div className="venue-form-card__field">
                <input
                  className="venue-form-card__input"
                  type="text"
                  id="address"
                  name="address"
                  placeholder=" "
                  value={form.address}
                  onChange={handleChange}
                />
                <label className="venue-form-card__label" htmlFor="address">
                  Address
                </label>
              </div>

              <div className="venue-form-card__field">
                <input
                  className="venue-form-card__input"
                  type="text"
                  id="zip"
                  name="zip"
                  placeholder=" "
                  value={form.zip}
                  onChange={handleChange}
                />
                <label className="venue-form-card__label" htmlFor="zip">
                  Zip code
                </label>
              </div>

              <div className="venue-form-card__field">
                <input
                  className="venue-form-card__input"
                  type="text"
                  id="city"
                  name="city"
                  placeholder=" "
                  value={form.city}
                  onChange={handleChange}
                />
                <label className="venue-form-card__label" htmlFor="city">
                  City
                </label>
              </div>

              <div className="venue-form-card__field">
                <input
                  className="venue-form-card__input"
                  type="text"
                  id="country"
                  name="country"
                  placeholder=" "
                  value={form.country}
                  onChange={handleChange}
                />
                <label className="venue-form-card__label" htmlFor="country">
                  Country
                </label>
              </div>
            </div>

            {/* ── Right column ── */}
            <div className="venue-form-card__col">
              <VenueMediaInputs
                mediaItems={mediaItems}
                onChange={handleMediaChange}
                onAdd={() =>
                  setMediaItems((prev) => [...prev, { ...EMPTY_MEDIA }])
                }
                onRemove={(index) =>
                  setMediaItems((prev) => prev.filter((_, i) => i !== index))
                }
              />

              <VenueAmenities
                values={form}
                onToggle={(key) =>
                  setForm((prev) => ({ ...prev, [key]: !prev[key] }))
                }
              />

              {error && <Alert type="error" message={error} />}
              {successMessage && (
                <Alert type="success" message={successMessage} />
              )}

              <button
                type="submit"
                className="venue-form-card__btn venue-form-card__btn--submit"
                disabled={saving}
              >
                {saving ? "Saving…" : isEditMode ? "Update" : "Create"}
              </button>

              {isEditMode && (
                <>
                  {!showDeleteConfirm ? (
                    <button
                      type="button"
                      className="venue-form-card__btn venue-form-card__btn--delete"
                      onClick={() => setShowDeleteConfirm(true)}
                      disabled={deleting}
                    >
                      Delete
                    </button>
                  ) : (
                    <VenueDeleteConfirm
                      deleting={deleting}
                      onConfirm={handleDelete}
                      onCancel={() => setShowDeleteConfirm(false)}
                    />
                  )}
                </>
              )}

              <button
                type="button"
                className="venue-form-card__btn venue-form-card__btn--cancel"
                onClick={() => navigate("/account")}
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default VenueForm
