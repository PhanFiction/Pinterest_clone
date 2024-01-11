import React, { useEffect, useState } from "react";
import PinEcho from "../../components/PinEcho/PinEcho";
import { useParams } from 'next/navigation';
import { getSinglePin, savePin, updateCommentLike, updatePinLike, createComment } from "../../service/pinService";
import { fetchUserCredentials } from "../../utils/auth"; // remove
import { getUser } from "../../service/authService";
import { findItem } from "../../utils/auth";
import Alert from '../../components/Alert/Alert';

const PinEchoPage = () => {
  const params = useParams();
  const [pinData, setPinData] = useState([]);
  const [message, setMessage] = useState('Cool Picture');
  const [user, setUserCredential] = useState([]);
  const [alertMessage, setAlertMessage] = useState(null);

  useEffect(() => {
    const fetchSinglePin = async () => {
      if(params) {
        const req = await getSinglePin(params.id);
        const userData = await getUser();
        console.log(req);
        setUserCredential(userData);
        const pinSaved = findItem(userData.saves, req._id);
        const pinLiked = findItem(userData.pinLikes, req._id);
        const commentLiked = req.comments.map(item => {
          const isLiked = userData.commentLikes.includes(item._id);
          return { ...item, isLiked };
        })
        const updatedPinData = { ...req, pinSaved, pinLiked, comments: [...commentLiked]};
        setPinData(updatedPinData);
      }
    }
    fetchSinglePin();
  }, [params]);

  const handleSavePin = async (e) => {
    e.preventDefault();
    const req = await savePin(params.id);
    try{
      if(req) {
          // Update the pinData with the new pinSaved value
        const updatedPinData = { ...pinData, pinSaved: !pinData.pinSaved };
        setPinData(updatedPinData);
      }
    } catch (error) {
      setMessage('Failed to save pin');
    }
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if(message.length < 1) return;
    try {
      const req = await createComment(params.id, {comment: message});
      setPinData((prev) => ({
        ...prev,
        comments: [...prev.comments, req.comment]
      }));
    } catch (error) {
      setAlertMessage('Failed to create comment');
    }
  }

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };

  const handleCommentLike = async (e, commentId) => {
    e.preventDefault();
    try {
      const req = await updateCommentLike(commentId);
      if(req.success) {
        const updatedComments = pinData.comments.map(comment => {
          if (comment._id === commentId) {
            const isLiked = comment.likes.includes(user._id);
          
            if (isLiked) {
              // If the user already liked the comment, remove their ID from the likes array
              const updatedLikes = comment.likes.filter(id => id !== user._id);
              return { ...comment, likes: updatedLikes, isLiked: false };
            } else {
              // If the user hasn't liked the comment, add their ID to the likes array
              const updatedLikes = [...comment.likes, user._id];
              return { ...comment, likes: updatedLikes, isLiked: true };
            }
          }
          return comment;
        });
        setPinData({...pinData, comments: [...updatedComments]});
      }
    }catch(error){}
  }

  const handlePinLike = async (e) => {
    e.preventDefault();
    await updatePinLike(params.id);
    try {
      // Update the pinData with the new pinSaved value
      const updatedPinData = { ...pinData, pinLiked: !pinData.pinLiked };
      setPinData(updatedPinData);
    } catch (error) {
      setMessage('Failed to like pin');
    }
  }

  const { _id, creator, comments, title, altText, description, imgPath, link, pinSaved, pinLiked } = pinData;

  return (
    <>
      {alertMessage && <Alert message={alertMessage} onClose={() => setAlertMessage(null)} />}
      <PinEcho 
        pinId={_id}
        pinCreator={creator}
        comments={comments}
        title= {title}
        altText={altText ? altText : ""}
        link={link}
        description={description}
        imgPath={imgPath}
        handleSavePin={handleSavePin}
        handleSubmitComment={handleSubmitComment}
        message={message}
        handleMessageChange={handleMessageChange}
        user={user}
        handleCommentLike={handleCommentLike}
        pinSaved={pinSaved}
        pinLiked={pinLiked}
        handlePinLike={handlePinLike}
      />
    </>
  )
};

export default PinEchoPage;