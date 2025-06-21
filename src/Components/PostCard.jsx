import React from 'react';
import { Card, CardBody, Button, Spinner } from 'reactstrap';
import { FaRegHeart, FaHeart, FaRegCommentDots, FaRegEdit, FaTrashAlt } from 'react-icons/fa';

const PostCard = ({
  post,
  onLike,
  onComment,
  onEdit,
  onDelete,
  likeLoading = false,
  deleteLoading = false,
  isLiked = false, // hozirgi user like bosganmi
}) => {
  return (
    <Card className="mb-3 post-card">
      <CardBody>
        <h5>{post.userId?.username || 'Anonim'}</h5>
        <p>{post.content}</p>
        {post.postImage && (
          typeof post.postImage === "string" ? (
            <img src={post.postImage} alt="Post" className="post-image" />
          ) : post.postImage.url ? (
            <img src={post.postImage.url} alt="Post" className="post-image" />
          ) : null
        )}
        <div className="btn-post-link">
          <Button
            color=""
            onClick={onLike}
            disabled={likeLoading}
            style={{ minWidth: 50 }}
            title="Like"
          >
            {likeLoading ? (
              <Spinner size="sm" color="danger" />
            ) : (
              isLiked ? (
                <FaHeart style={{ color: '#ff5252', fontSize: 22 }} />
              ) : (
                <FaRegHeart style={{ color: '#ff5252', fontSize: 22 }} />
              )
            )}
            <span style={{ fontWeight: 500, color: '#444', marginLeft: 4 }}>
              {post.likes?.length || 0}
            </span>
          </Button>
          <Button color="" onClick={onComment} title="Komment">
            <FaRegCommentDots style={{ color: '#0ea5e9', fontSize: 22 }} />
            <span style={{ fontWeight: 500, color: '#444', marginLeft: 4 }}>
              {post.comments?.length || 0}
            </span>
          </Button>
          <Button color="link" onClick={onEdit} title="Tahrirlash">
            <FaRegEdit style={{ color: '#f59e42', fontSize: 20 }} />
          </Button>
          <Button
            color="link"
            onClick={onDelete}
            disabled={deleteLoading}
            style={{ minWidth: 40 }}
            title="O‘chirish"
          >
            {deleteLoading ? (
              <Spinner size="sm" color="danger" />
            ) : (
              <FaTrashAlt style={{ color: '#ff5252', fontSize: 20 }} />
            )}
          </Button>
        </div>
      </CardBody>
    </Card>
  );
};

export default PostCard;