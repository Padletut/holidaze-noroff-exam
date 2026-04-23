import { useState } from "react"
import { updateProfile } from "../../api/profiles/updateProfile"
import { loadStorage } from "../../utils/loadStorage.mjs"
import { saveStorage } from "../../utils/saveStorage.mjs"

function EditProfileModal({ profile, onClose, onSave }) {
  const [bio, setBio] = useState(profile.bio || "")
  const [avatarUrl, setAvatarUrl] = useState(profile.avatar?.url || "")
  const [bannerUrl, setBannerUrl] = useState(profile.banner?.url || "")
  const [error, setError] = useState(null)
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setSaving(true)

    const body = {}
    if (bio.trim()) body.bio = bio.trim()
    if (avatarUrl.trim()) {
      body.avatar = { url: avatarUrl.trim(), alt: profile.name }
    }
    if (bannerUrl.trim()) {
      body.banner = { url: bannerUrl.trim(), alt: profile.name }
    }

    if (Object.keys(body).length === 0) {
      setError("Please provide at least one field to update.")
      setSaving(false)
      return
    }

    try {
      const updated = await updateProfile(profile.name, body)
      const stored = loadStorage("profile") || {}
      saveStorage("profile", { ...stored, ...updated })
      onSave(updated)
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div
      className="modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-profile-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="modal-card">
        <h2 id="edit-profile-title" className="modal-card__title">
          Edit Profile
        </h2>

        <form onSubmit={handleSubmit} noValidate>
          <div className="modal-card__field">
            <label htmlFor="bio" className="modal-card__label">
              Bio
            </label>
            <textarea
              id="bio"
              className="modal-card__textarea"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={4}
            />
          </div>

          <div className="modal-card__field">
            <label htmlFor="avatarUrl" className="modal-card__label">
              Avatar URL
            </label>
            <input
              id="avatarUrl"
              type="url"
              className="modal-card__input"
              placeholder="https://images.com/image.jpg"
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
            />
          </div>

          <div className="modal-card__field">
            <label htmlFor="bannerUrl" className="modal-card__label">
              Banner URL
            </label>
            <input
              id="bannerUrl"
              type="url"
              className="modal-card__input"
              placeholder="https://banners.org/banner.jpg"
              value={bannerUrl}
              onChange={(e) => setBannerUrl(e.target.value)}
            />
          </div>

          {error && <p className="modal-card__error">{error}</p>}

          <div className="modal-card__actions">
            <button
              type="submit"
              className="modal-card__btn modal-card__btn--save"
              disabled={saving}
            >
              {saving ? "Saving…" : "Save"}
            </button>
            <button
              type="button"
              className="modal-card__btn modal-card__btn--cancel"
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditProfileModal
