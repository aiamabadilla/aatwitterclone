import React, {
  useContext,
  useState,
  useRef,
  useEffect,
  useCallback,
} from "react";
import { Redirect, useParams, useHistory } from "react-router-dom";
import Modal from "react-modal";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import moment from "moment";
import TextareaAutosize from "react-textarea-autosize";

import { getUser, patchUser } from "../../../api";
import { UserContext } from "../../AppRouter";

import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import LockIcon from "@material-ui/icons/Lock";
import CakeOutlinedIcon from "@material-ui/icons/CakeOutlined";
import CalendarTodayOutlinedIcon from "@material-ui/icons/CalendarTodayOutlined";
import CloseIcon from "@material-ui/icons/Close";
import CameraEnhanceOutlinedIcon from "@material-ui/icons/CameraEnhanceOutlined";
import CircularProgress from "@material-ui/core/CircularProgress";

import "../../../styles/pages/body/Profile.css";

Modal.setAppElement("#root");

const minBannerCroppedWidth = 600;
const minBannerCroppedHeight = 185.19;
const maxBannerCroppedWidth = 600;
const maxBannerCroppedHeight = 185.19;

const minAvatarCroppedWidth = 600;
const minAvatarCroppedHeight = 600;
const maxAvatarCroppedWidth = 600;
const maxAvatarCroppedHeight = 600;

const Profile = () => {
  const history = useHistory();
  const { username } = useParams();
  const [user, setUser] = useContext(UserContext);
  const [loading, setLoading] = useState({ getUser: true, uploadSave: false });
  const [preview, setPreview] = useState({ banner: "", avatar: "" });
  const [image, setImage] = useState({ banner: null, avatar: null });
  const inputFile = { banner: useRef(null), avatar: useRef(null) };
  const [profile, setProfile] = useState({
    edit: {},
    view: {},
  });
  const [modalOpen, setModalOpen] = useState({
    profile: false,
    banner: false,
    avatar: false,
  });
  const [border, setBorder] = useState({
    name: false,
    bio: false,
    date: false,
  });
  const [cropData, setCropData] = useState({ banner: "", avatar: "" });
  const [cropper, setCropper] = useState({
    banner: undefined,
    avatar: undefined,
  });
  const cropperRef = { banner: useRef(null), avatar: useRef(null) };
  const cropperInst = { banner: useRef(null), avatar: useRef(null) };
  const [date, setDate] = useState({ edit: false, birthdate: "" });

  const openProfileModal = () => {
    setModalOpen({ ...modalOpen, profile: true });
  };

  const closeProfileModal = () => {
    setProfile({
      ...profile,
      edit: { ...user.user, newBanner: "", newAvatar: "" },
    });
    setModalOpen({ ...modalOpen, profile: false });
    setDate({ ...date, edit: false });
  };

  const openBannerModal = () => {
    setModalOpen({ ...modalOpen, banner: true });
  };

  const closeBannerModal = () => {
    setModalOpen({ ...modalOpen, banner: false });
    getCropData("banner");
  };

  const openAvatarModal = () => {
    setModalOpen({ ...modalOpen, avatar: true });
  };

  const closeAvatarModal = () => {
    setModalOpen({ ...modalOpen, avatar: false });
    getCropData("avatar");
  };

  const getCropData = (data) => {
    if (typeof cropper[data] !== "undefined") {
      setCropData({
        ...cropData,
        [data]: cropper[data].getCroppedCanvas().toDataURL(),
      });
      if (data === "banner") {
        setProfile({
          ...profile,
          edit: {
            ...profile.edit,
            newBanner: cropper[data].getCroppedCanvas().toDataURL(),
          },
        });
      }
      if (data === "avatar") {
        setProfile({
          ...profile,
          edit: {
            ...profile.edit,
            newAvatar: cropper[data].getCroppedCanvas().toDataURL(),
          },
        });
      }
    }
  };

  const handleImageUpload = (e) => {
    const target = e.currentTarget.className;
    if (
      target ===
      "MuiButtonBase-root MuiButton-root MuiButton-text profile__editAvatarButton"
    )
      inputFile["avatar"].current.click();
    if (
      target ===
      "MuiButtonBase-root MuiButton-root MuiButton-text profile__editBannerButton"
    ) {
      inputFile["banner"].current.click();
    }
  };

  const onBannerCrop = useCallback(
    (event) => {
      var width = event.detail.width;
      var height = event.detail.height;
      if (
        width < minBannerCroppedWidth ||
        height < minBannerCroppedHeight ||
        width > maxBannerCroppedWidth ||
        height > maxBannerCroppedHeight
      ) {
        if (
          cropperRef.banner.current !== null &&
          cropperInst.banner.current !== null
        ) {
          setTimeout(() => {
            cropperInst.banner.current.setData({
              width: Math.max(
                minBannerCroppedWidth,
                Math.min(maxBannerCroppedWidth, width)
              ),
              height: Math.max(
                minBannerCroppedHeight,
                Math.min(maxBannerCroppedHeight, height)
              ),
            });
          });
        }
      }
    },
    // eslint-disable-next-line
    [cropperInst.banner]
  );

  const onAvatarCrop = useCallback(
    (event) => {
      var width = event.detail.width;
      var height = event.detail.height;
      if (
        width < minAvatarCroppedWidth ||
        height < minAvatarCroppedHeight ||
        width > maxAvatarCroppedWidth ||
        height > maxAvatarCroppedHeight
      ) {
        if (
          cropperRef.avatar.current !== null &&
          cropperInst.avatar.current !== null
        ) {
          setTimeout(() => {
            cropperInst.avatar.current.setData({
              width: Math.max(
                minAvatarCroppedWidth,
                Math.min(maxAvatarCroppedWidth, width)
              ),
              height: Math.max(
                minAvatarCroppedHeight,
                Math.min(maxAvatarCroppedHeight, height)
              ),
            });
          });
        }
      }
    },
    // eslint-disable-next-line
    [cropperInst.avatar]
  );

  const handleImageFile = (e) => {
    const file = e.target.files[0];
    if (e.target.name === "banner") {
      if (file && file.type.substr(0, 5) === "image") {
        setImage({ ...image, banner: file });
      } else {
        setImage({ ...image, banner: null });
      }
    }
    if (e.target.name === "avatar") {
      if (file && file.type.substr(0, 5) === "image") {
        setImage({ ...image, avatar: file });
      } else {
        setImage({ ...image, avatar: null });
      }
    }
  };

  const handleSaveEdit = async () => {
    if (profile.name === "") {
      return console.log("Profile name required.");
    }
    setLoading({ ...loading, uploadSave: true });
    patchUser(profile.edit)
      .then((res) => {
        // LIVE UPDATE ON PROFILE AND ALL TWEETS ASSOCIATED WITH ACCOUNT
        setUser({ ...user, user: res.data });
        setLoading({ ...loading, uploadSave: false });
        closeProfileModal();
      })
      .catch((err) => {
        console.log(err);
        setLoading({ ...loading, uploadSave: true });
      });
  };

  const handleInputClick = (e) => {
    const target = e.currentTarget.className;
    if (target === "profile__editName") {
      setBorder({
        name: true,
        bio: false,
        date: false,
      });
    }
    if (target === "profile__editBio") {
      setBorder({
        name: false,
        bio: true,
        date: false,
      });
    }
    if (target === "profile__editDate") {
      setBorder({
        name: false,
        bio: false,
        date: true,
      });
    }
  };

  const handleDate = () => {
    setDate({ ...date, edit: !date.edit });
  };

  const saveDate = () => {
    setProfile({
      ...profile,
      edit: { ...profile.edit, birthday: new Date(date.birthdate) },
    });
    setDate({ birthdate: "", edit: false });
  };

  useEffect(() => {
    if (image.banner) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview({ ...preview, banner: reader.result });
        openBannerModal();
      };
      reader.readAsDataURL(image.banner);
    } else {
      setPreview({ ...preview, banner: "" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [image.banner]);

  useEffect(() => {
    if (image.avatar) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview({ ...preview, avatar: reader.result });
        openAvatarModal();
      };
      reader.readAsDataURL(image.avatar);
    } else {
      setPreview({ ...preview, avatar: "" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [image.avatar]);

  useEffect(() => {
    getUser(username)
      .then((res) => {
        if (!Object.keys(res.data).length) {
          localStorage.setItem("active", "Home");
          return history.push("/u/home");
        }
        setProfile({
          edit: { ...user.user, newBanner: "", newAvatar: "" },
          view: res.data,
        });
        setLoading({ ...loading, getUser: false });
      })
      .catch((err) => {
        console.log(err);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const normalise = (value, min, max) => ((value - min) * max) / (max - min);

  if (!user.accesstoken) return <Redirect to="/u/login" />;

  return (
    <div className="profileWrapper">
      {loading.getUser ? (
        <div className="feed__loading">
          <CircularProgress className="loading__CircularProgress" />
        </div>
      ) : (
        <div className="profile">
          {profile.view.banner.url !== "" ? (
            <img
              src={profile.view.banner.url}
              alt=""
              className="profile__banner"
            />
          ) : (
            <div className="profile__banner"></div>
          )}
          <div
            className="profile__description"
            style={{
              paddingTop: user.user._id === profile.view._id ? "0" : "46px",
            }}
          >
            <Avatar src={profile.view.avatar.url} className="profile__Avatar" />
            <div className="profile__EditButtonWrapper">
              {user.user._id === profile.view._id && (
                <Button
                  className="profile__EditButton"
                  onClick={openProfileModal}
                >
                  Edit Profile
                </Button>
              )}
              <Modal
                isOpen={modalOpen.profile}
                onRequestClose={closeProfileModal}
                className="profile__editModal"
                overlayClassName="profile__editOverlay"
              >
                <form action="" className="profile__editForm">
                  <div className="profile__editHeader">
                    <div className="profile__editHeaderLeft">
                      <Button className="profile__editCloseButton">
                        <CloseIcon
                          onClick={closeProfileModal}
                          className="profile__editCloseIcon"
                        />
                      </Button>
                      <h5 className="profile__editTitle">Edit Profile</h5>
                    </div>
                    <Button
                      className="profile__editSave"
                      onClick={handleSaveEdit}
                    >
                      Save
                    </Button>
                  </div>
                  <div
                    className="profile__editBannerContent"
                    style={{
                      backgroundImage: `url(${
                        profile.edit.newBanner
                          ? profile.edit.newBanner
                          : profile.view.banner.url
                      })`,
                    }}
                  >
                    <Button
                      className="profile__editBannerButton"
                      name="banner"
                      onClick={handleImageUpload}
                    >
                      <CameraEnhanceOutlinedIcon className="profile__editIcon" />
                      <input
                        name="banner"
                        id="banner"
                        type="file"
                        accept="image/*"
                        className="profile__editBannerUpload"
                        ref={inputFile.banner}
                        onChange={handleImageFile}
                        style={{ display: "none" }}
                      />
                    </Button>
                  </div>
                  <div className="profile__editContent">
                    <div className="profile__editAvatarContent">
                      <Avatar
                        src={
                          profile.edit.newAvatar
                            ? profile.edit.newAvatar
                            : profile.view.avatar.url
                        }
                        className="profile__editAvatar"
                      />
                      <Button
                        className="profile__editAvatarButton"
                        onClick={handleImageUpload}
                      >
                        <CameraEnhanceOutlinedIcon className="profile__editIcon" />

                        <input
                          name="avatar"
                          id="avatar"
                          type="file"
                          accept="image/*"
                          className="profile__editAvatarUpload"
                          ref={inputFile.avatar}
                          onChange={handleImageFile}
                          style={{ display: "none" }}
                        />
                      </Button>
                    </div>
                    <div className="profile__editTextContent">
                      <div
                        className="profile__editName"
                        onClick={handleInputClick}
                        style={{
                          border: border.name && "2px solid var(--primary)",
                        }}
                      >
                        <label
                          htmlFor="name"
                          className="profile__editNameLabel"
                        >
                          <h5
                            className="profile__editNameLabelText"
                            style={{ color: border.name && "var(--primary)" }}
                          >
                            Name
                          </h5>
                          <h5
                            className="profile__editNameLabelAmount"
                            style={{ display: border.name && "block" }}
                          >
                            {normalise(profile.edit.name.length, 0, 50)}/50
                          </h5>
                        </label>
                        <TextareaAutosize
                          className="profile__editNameInput"
                          name="name"
                          id="name"
                          value={profile.edit.name}
                          placeholder="Name"
                          maxLength="50"
                          onChange={(e) =>
                            setProfile({
                              ...profile,
                              edit: {
                                ...profile.edit,
                                [e.target.name]: e.target.value,
                              },
                            })
                          }
                        ></TextareaAutosize>
                      </div>
                      <div
                        className="profile__editBio"
                        onClick={handleInputClick}
                        style={{
                          color: border.bio && "var(--primary)",
                          border: border.bio && "2px solid var(--primary)",
                        }}
                      >
                        <label htmlFor="bio" className="profile__editBioLabel">
                          <h5
                            className="profile__editBioLabelText"
                            style={{ color: border.bio && "var(--primary)" }}
                          >
                            Bio
                          </h5>
                          <h5
                            className="profile__editBioLabelAmount"
                            style={{ display: border.bio && "block" }}
                          >
                            {normalise(profile.edit.bio.length, 0, 200)}/200
                          </h5>
                        </label>
                        <TextareaAutosize
                          className="profile__editBioInput"
                          name="bio"
                          id="bio"
                          value={profile.edit.bio}
                          placeholder="bio"
                          maxLength="200"
                          onChange={(e) =>
                            setProfile({
                              ...profile,
                              edit: {
                                ...profile.edit,
                                [e.target.name]: e.target.value,
                              },
                            })
                          }
                        ></TextareaAutosize>
                      </div>
                      <div
                        className="profile__editDate"
                        onClick={handleInputClick}
                        style={{
                          color: border.date && "var(--primary)",
                          border: border.date && "2px solid var(--primary)",
                        }}
                      >
                        <div className="profile__editDateWrapper">
                          <div className="profile__viewDate">
                            <h5
                              className="profile__editDate"
                              style={{ display: date.edit && "none" }}
                            >
                              {moment(profile.edit.birthday).format(
                                "MM/DD/YYYY"
                              )}
                            </h5>
                            <Button
                              className="profile__editDateButton"
                              style={{ display: date.edit && "none" }}
                              onClick={handleDate}
                            >
                              Edit
                            </Button>
                            <Button
                              className="profile__saveDateButton"
                              onClick={saveDate}
                              disabled={
                                moment(date.birthdate).format("MM/DD/YYYY") ===
                                "Invalid date"
                              }
                              style={{
                                display: !date.edit && "none",
                              }}
                            >
                              Save
                            </Button>
                            <Button
                              className="profile__cancelDateButton"
                              onClick={handleDate}
                              style={{ display: !date.edit && "none" }}
                            >
                              Cancel
                            </Button>
                          </div>
                          <label
                            style={{ display: !date.edit && "none" }}
                            htmlFor="birthday"
                            className="profile__editDateLabel"
                          >
                            Birthday
                          </label>
                          <input
                            name="birthday"
                            id="birthday"
                            type="text"
                            style={{ display: !date.edit && "none" }}
                            value={date.birthdate}
                            placeholder="MM/DD/YYYY"
                            className="profile__editDateInput"
                            onChange={(e) =>
                              setDate({ ...date, birthdate: e.target.value })
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
              </Modal>
              <Modal
                isOpen={modalOpen.banner}
                onRequestClose={closeBannerModal}
                className="profile__editBannerModal"
                overlayClassName="profile__editBannerOverlay"
              >
                <div className="profile__editHeader">
                  <div className="profile__editHeaderLeft">
                    <Button className="profile__editClose">
                      <CloseIcon onClick={closeBannerModal} />
                    </Button>
                    <h5 className="profile__editTitle">Edit Media</h5>
                  </div>
                  <Button
                    className="profile__editSave"
                    onClick={closeBannerModal}
                  >
                    Apply
                  </Button>
                </div>
                <Cropper
                  className="profile__editBannerCropper"
                  src={preview.banner}
                  ref={cropperRef.banner}
                  zoomTo={0}
                  initialAspectRatio={16 / 9}
                  preview=".img-preview"
                  viewMode={3}
                  crop={onBannerCrop}
                  dragMode="move"
                  minCropBoxHeight={185.19}
                  minCropBoxWidth={600}
                  cropBoxResizable={false}
                  background={false}
                  autoCropArea={1}
                  checkOrientation={false}
                  onInitialized={(instance) => {
                    cropperInst.banner.current = instance;
                    setCropper({ ...cropper, banner: instance });
                  }}
                />
              </Modal>
              <Modal
                isOpen={modalOpen.avatar}
                onRequestClose={closeAvatarModal}
                className="profile__editAvatarModal"
                overlayClassName="profile__editAvatarOverlay"
              >
                <div className="profile__editHeader">
                  <div className="profile__editHeaderLeft">
                    <Button className="profile__editClose">
                      <CloseIcon onClick={closeAvatarModal} />
                    </Button>
                    <h5 className="profile__editTitle">Edit Media</h5>
                  </div>
                  <Button
                    className="profile__editSave"
                    onClick={closeAvatarModal}
                  >
                    Apply
                  </Button>
                </div>
                <Cropper
                  className="profile__editAvatarCropper"
                  src={preview.avatar}
                  ref={cropperRef.avatar}
                  zoomTo={0}
                  initialAspectRatio={16 / 9}
                  preview=".img-preview"
                  viewMode={3}
                  crop={onAvatarCrop}
                  dragMode="move"
                  minCropBoxHeight={600}
                  minCropBoxWidth={600}
                  cropBoxResizable={false}
                  background={false}
                  autoCropArea={1}
                  checkOrientation={false}
                  onInitialized={(instance) => {
                    cropperInst.avatar.current = instance;
                    setCropper({ ...cropper, avatar: instance });
                  }}
                />
              </Modal>
            </div>
            <div className="profile__info">
              <div className="profile__names">
                <div className="profile__protectedname">
                  <h2>{profile.view.name}</h2>
                  {profile.view.protected && <LockIcon />}
                </div>
                <h5 className="profile__name">@{profile.view.username}</h5>
              </div>
              <p className="profile__bio">{profile.view.bio}</p>
              <div className="profile__dates">
                {profile.view.birthday && (
                  <div className="profile__birthday">
                    <CakeOutlinedIcon />
                    <p>
                      Born on{" "}
                      {moment(profile.view.birthday).format("MMMM DD,YYYY")}
                    </p>
                  </div>
                )}
                <div className="profile__createdon">
                  <CalendarTodayOutlinedIcon />
                  <p>{moment(profile.view.created_on).format("MMMM YYYY")}</p>
                </div>
              </div>
              <div className="profile__follow">
                <h5>
                  <span>{profile.view.following_count}</span> Following
                </h5>
                <h5>
                  <span>{profile.view.followers_count}</span> Followers
                </h5>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
